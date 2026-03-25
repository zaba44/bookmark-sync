using System.Diagnostics;

namespace BookmarkSyncHost;

public class TrayApp
{
    private readonly AppConfig      _config;
    private readonly HttpServer     _server;
    private readonly ClientRegistry _registry;
    private readonly Form           _owner;
    private NotifyIcon              _trayIcon      = null!;
    private ContextMenuStrip        _menu          = null!;
    private ToolStripMenuItem       _menuProfiles  = null!;
    private ToolStripMenuItem       _menuClients   = null!;
    private ToolStripMenuItem       _menuAutostart = null!;
    private ToolStripMenuItem       _menuPort      = null!;
    private readonly List<string>   _logLines      = [];
    private readonly SemaphoreSlim  _approvalLock  = new(1, 1);

    public TrayApp(AppConfig config, HttpServer server, ClientRegistry registry, Form owner)
    {
        _config   = config;
        _server   = server;
        _registry = registry;
        _owner    = owner;

        _registry.OnNewClientRequest = AskUserAboutNewClient;
        _server.OnLog += msg =>
        {
            _logLines.Add($"{DateTime.Now:HH:mm:ss}  {msg}");
            if (_logLines.Count > 200) _logLines.RemoveAt(0);
        };

        InitializeTray();
    }

    private void InitializeTray()
    {
        _menu = new ContextMenuStrip();
        _menu.Items.Add(new ToolStripMenuItem("Bookmark Sync Host") { Enabled = false });
        _menu.Items.Add(new ToolStripSeparator());

        // Profile
        _menuProfiles = new ToolStripMenuItem("Profile sync");
        _menuProfiles.DropDownOpening += (_, _) => RebuildProfilesSubmenu();
        _menu.Items.Add(_menuProfiles);

        _menuPort = new ToolStripMenuItem($"Port: {_config.Port}") { Enabled = false };
        _menu.Items.Add(_menuPort);

        _menu.Items.Add(new ToolStripSeparator());

        // Polaczone przegladarki
        _menuClients = new ToolStripMenuItem("Polaczone przegladarki");
        _menuClients.DropDownOpening += (_, _) => RebuildClientsSubmenu();
        _menu.Items.Add(_menuClients);

        _menu.Items.Add(new ToolStripSeparator());

        var menuChangePort = new ToolStripMenuItem("Zmien port...");
        menuChangePort.Click += (_, _) => ShowChangePortDialog();
        _menu.Items.Add(menuChangePort);

        var menuLog = new ToolStripMenuItem("Pokaz log...");
        menuLog.Click += (_, _) => ShowLog();
        _menu.Items.Add(menuLog);

        _menu.Items.Add(new ToolStripSeparator());

        _menuAutostart = new ToolStripMenuItem("Autostart z Windows")
        {
            CheckOnClick = true,
            Checked      = _config.Autostart
        };
        _menuAutostart.CheckedChanged += (_, _) => ToggleAutostart(_menuAutostart.Checked);
        _menu.Items.Add(_menuAutostart);

        _menu.Items.Add(new ToolStripSeparator());

        var menuExit = new ToolStripMenuItem("Zakoncz");
        menuExit.Click += (_, _) => ExitApp();
        _menu.Items.Add(menuExit);

        _trayIcon = new NotifyIcon
        {
            Icon             = CreateIcon(),
            Text             = "Bookmark Sync Host",
            ContextMenuStrip = _menu,
            Visible          = true
        };

        _trayIcon.DoubleClick += (_, _) => ShowProfilesDialog();
    }

    // ================================================================
    // Profile
    // ================================================================

    private void RebuildProfilesSubmenu()
    {
        _menuProfiles.DropDownItems.Clear();

        foreach (var profile in _config.Profiles)
        {
            var label = $"{(profile.IsDefault ? "[domyslny] " : "")}{profile.Name}  |  {profile.Path}";
            var item  = new ToolStripMenuItem(label);
            var pid   = profile.Id;

            item.DropDownItems.Add("Ustaw jako domyslny").Click += (_, _) => SetDefaultProfile(pid);
            item.DropDownItems.Add("Otworz folder").Click       += (_, _) => OpenFolder(profile.Path);
            item.DropDownItems.Add(new ToolStripSeparator());
            item.DropDownItems.Add("Usun profil...").Click       += (_, _) => DeleteProfile(pid);
            _menuProfiles.DropDownItems.Add(item);
        }

        if (_config.Profiles.Count > 0)
            _menuProfiles.DropDownItems.Add(new ToolStripSeparator());

        _menuProfiles.DropDownItems.Add("+ Dodaj profil...").Click += (_, _) => ShowAddProfileDialog();
        _menuProfiles.DropDownItems.Add("Zarzadzaj profilami...").Click += (_, _) => ShowProfilesDialog();
    }

    private void SetDefaultProfile(string profileId)
    {
        foreach (var p in _config.Profiles) p.IsDefault = (p.Id == profileId);
        _config.Save();
        ShowBalloon("Domyslny profil zmieniony");
    }

    private void DeleteProfile(string profileId)
    {
        var profile = _config.Profiles.FirstOrDefault(p => p.Id == profileId);
        if (profile == null) return;
        if (!Confirm($"Usunac profil \"{profile.Name}\"?\n\nPliki w katalogu NIE zostana usuniete.")) return;

        _config.Profiles.Remove(profile);
        if (_config.Profiles.Count > 0 && !_config.Profiles.Any(p => p.IsDefault))
            _config.Profiles[0].IsDefault = true;
        _config.Save();
    }

    private void ShowAddProfileDialog()
    {
        using var form = new Form
        {
            Text            = "Dodaj profil synchronizacji",
            Size            = new Size(560, 200),
            FormBorderStyle = FormBorderStyle.FixedDialog,
            StartPosition   = FormStartPosition.CenterScreen,
            MaximizeBox     = false,
            TopMost         = true
        };

        var lblName = new Label { Text = "Nazwa profilu:", Location = new Point(12, 14), AutoSize = true };
        var inputName = new TextBox { Location = new Point(12, 34), Width = 200, Text = "Glowny" };

        var lblPath = new Label { Text = "Katalog synchronizacji:", Location = new Point(12, 68), AutoSize = true };
        var inputPath = new TextBox { Location = new Point(12, 88), Width = 430 };

        var btnBrowse = new Button { Text = "Przegladaj...", Location = new Point(448, 86), Width = 92, Height = 26 };
        btnBrowse.Click += (_, _) =>
        {
            var currentPath = inputPath.Text.Trim();
            var thread = new Thread(() =>
            {
                using var dlg = new FolderBrowserDialog
                {
                    Description         = "Wybierz katalog synchronizacji",
                    ShowNewFolderButton = true,
                    SelectedPath        = currentPath
                };
                if (dlg.ShowDialog() == DialogResult.OK)
                {
                    var picked = string.IsNullOrWhiteSpace(dlg.SelectedPath) ? currentPath : dlg.SelectedPath;
                    form.BeginInvoke(() => inputPath.Text = picked);
                }
            });
            thread.SetApartmentState(ApartmentState.STA);
            thread.IsBackground = true;
            thread.Start();
        };

        var chkDefault = new CheckBox { Text = "Ustaw jako domyslny", Location = new Point(12, 122), AutoSize = true };
        if (_config.Profiles.Count == 0) { chkDefault.Checked = true; chkDefault.Enabled = false; }

        var btnOk  = new Button { Text = "Dodaj",  Location = new Point(360, 130), Width = 90, DialogResult = DialogResult.OK };
        var btnCan = new Button { Text = "Anuluj", Location = new Point(458, 130), Width = 90, DialogResult = DialogResult.Cancel };

        form.Controls.AddRange([lblName, inputName, lblPath, inputPath, btnBrowse, chkDefault, btnOk, btnCan]);
        form.AcceptButton = btnOk;
        form.CancelButton = btnCan;

        if (form.ShowDialog() != DialogResult.OK) return;

        var name = inputName.Text.Trim();
        var path = inputPath.Text.Trim();

        if (string.IsNullOrWhiteSpace(name) || string.IsNullOrWhiteSpace(path))
        {
            ShowError("Nazwa i katalog nie moga byc puste.");
            return;
        }

        try
        {
            Directory.CreateDirectory(path);
            if (chkDefault.Checked)
                foreach (var p in _config.Profiles) p.IsDefault = false;

            _config.Profiles.Add(new SyncProfile
            {
                Id        = Guid.NewGuid().ToString(),
                Name      = name,
                Path      = path,
                IsDefault = chkDefault.Checked || _config.Profiles.Count == 0,
            });
            _config.Save();
            ShowBalloon($"Dodano profil: {name}");
        }
        catch (Exception ex)
        {
            ShowError("Blad: " + ex.Message);
        }
    }

    private void ShowProfilesDialog()
    {
        // Jeśli nie ma profili — od razu otwórz dodawanie
        if (_config.Profiles.Count == 0) { ShowAddProfileDialog(); return; }

        using var form = new Form
        {
            Text            = "Zarzadzanie profilami",
            Size            = new Size(580, 360),
            FormBorderStyle = FormBorderStyle.FixedDialog,
            StartPosition   = FormStartPosition.CenterScreen,
            MaximizeBox     = false,
            TopMost         = true
        };

        var list = new ListView
        {
            Location      = new Point(12, 12),
            Size          = new Size(540, 200),
            View          = View.Details,
            FullRowSelect = true,
            GridLines     = true
        };
        list.Columns.Add("Nazwa",    140);
        list.Columns.Add("Katalog",  300);
        list.Columns.Add("Domyslny", 80);

        void RefreshList()
        {
            list.Items.Clear();
            foreach (var p in _config.Profiles)
            {
                var item = new ListViewItem(p.Name);
                item.SubItems.Add(p.Path);
                item.SubItems.Add(p.IsDefault ? "Tak" : "");
                item.Tag = p.Id;
                list.Items.Add(item);
            }
        }
        RefreshList();

        var btnAdd = new Button { Text = "+ Dodaj",    Location = new Point(12,  224), Width = 100 };
        var btnDel = new Button { Text = "Usun",       Location = new Point(120, 224), Width = 100 };
        var btnDef = new Button { Text = "Domyslny",   Location = new Point(228, 224), Width = 100 };
        var btnClose = new Button { Text = "Zamknij",  Location = new Point(460, 290), Width = 90, DialogResult = DialogResult.OK };

        btnAdd.Click += (_, _) => { form.Hide(); ShowAddProfileDialog(); RefreshList(); form.Show(); };

        btnDel.Click += (_, _) =>
        {
            if (list.SelectedItems.Count == 0) return;
            var id = (string)list.SelectedItems[0].Tag!;
            DeleteProfile(id);
            RefreshList();
        };

        btnDef.Click += (_, _) =>
        {
            if (list.SelectedItems.Count == 0) return;
            var id = (string)list.SelectedItems[0].Tag!;
            SetDefaultProfile(id);
            RefreshList();
        };

        form.Controls.AddRange([list, btnAdd, btnDel, btnDef, btnClose]);
        form.AcceptButton = btnClose;
        form.ShowDialog();
    }

    // ================================================================
    // Polaczone przegladarki
    // ================================================================

    private void RebuildClientsSubmenu()
    {
        _menuClients.DropDownItems.Clear();
        var clients = _registry.GetAllowed();

        if (clients.Count == 0)
        {
            _menuClients.DropDownItems.Add(new ToolStripMenuItem("(brak polaczonych)") { Enabled = false });
            return;
        }

        foreach (var c in clients)
        {
            var profile = _config.GetProfile(c.ProfileId);
            var label   = $"{c.DisplayName}  [{profile?.Name ?? "?"}]  {c.LastSeen:HH:mm dd.MM}";
            var item    = new ToolStripMenuItem(label);
            var id      = c.InstanceId;
            item.DropDownItems.Add("Odwolaj dostep").Click += (_, _) =>
            {
                if (Confirm($"Odwolac dostep dla:\n{c.DisplayName}?"))
                    _registry.RevokeClient(id);
            };
            _menuClients.DropDownItems.Add(item);
        }
    }

    // ================================================================
    // Okno akceptacji nowego klienta
    // ================================================================

    private (bool allowed, string displayName, string profileId) AskUserAboutNewClient(ConnectedClient client)
    {
        _approvalLock.Wait();
        try
        {
            bool   allowed     = false;
            string displayName = client.DisplayName;
            string profileId   = _config.DefaultProfile?.Id ?? "";

            ShowBalloon($"Nowe polaczenie: {client.BrowserName}");

            _owner.Invoke(() =>
            {
                using var tempOwner = new Form
                {
                    Size            = new Size(1, 1),
                    StartPosition   = FormStartPosition.CenterScreen,
                    FormBorderStyle = FormBorderStyle.None,
                    TopMost         = true,
                    ShowInTaskbar   = true,
                    Text            = "Bookmark Sync"
                };
                tempOwner.Show();
                tempOwner.BringToFront();
                tempOwner.Activate();

                // Sugerowana nazwa: HOSTNAME-BROWSER
                var suggestedName = $"{Environment.MachineName}-{client.BrowserName}";

                using var form = new Form
                {
                    Text            = "Bookmark Sync - Nowe polaczenie",
                    Size            = new Size(460, 280),
                    FormBorderStyle = FormBorderStyle.FixedDialog,
                    StartPosition   = FormStartPosition.CenterParent,
                    MaximizeBox     = false,
                    TopMost         = true
                };

                var lblInfo = new Label
                {
                    Text     = $"Nowa przegladarka chce sie polaczyc:" +
                               Environment.NewLine + Environment.NewLine +
                               $"Silnik: {client.BrowserName}" + Environment.NewLine +
                               $"ID: {client.InstanceId[..Math.Min(16, client.InstanceId.Length)]}...",
                    Location = new Point(12, 12),
                    Size     = new Size(420, 72),
                    AutoSize = false
                };

                var lblName = new Label { Text = "Nazwa parowania:", Location = new Point(12, 96), AutoSize = true };
                var inputName = new TextBox { Text = suggestedName, Location = new Point(12, 116), Width = 420 };

                var lblProfile = new Label { Text = "Profil synchronizacji:", Location = new Point(12, 148), AutoSize = true };
                var comboProfile = new ComboBox
                {
                    Location      = new Point(12, 168),
                    Width         = 420,
                    DropDownStyle = ComboBoxStyle.DropDownList,
                };

                foreach (var p in _config.Profiles)
                    comboProfile.Items.Add(p);
                comboProfile.DisplayMember = "Name";
                comboProfile.SelectedItem  = _config.DefaultProfile ?? _config.Profiles.FirstOrDefault();

                var btnAllow = new Button { Text = "Zezwol", Location = new Point(250, 210), Width = 90, DialogResult = DialogResult.Yes };
                var btnDeny  = new Button { Text = "Odrzuc", Location = new Point(350, 210), Width = 90, DialogResult = DialogResult.No };

                form.Controls.AddRange([lblInfo, lblName, inputName, lblProfile, comboProfile, btnAllow, btnDeny]);
                form.AcceptButton = btnAllow;

                var result = form.ShowDialog(tempOwner);
                allowed     = result == DialogResult.Yes;
                displayName = inputName.Text.Trim();
                if (string.IsNullOrWhiteSpace(displayName)) displayName = suggestedName;
                profileId   = (comboProfile.SelectedItem as SyncProfile)?.Id ?? _config.DefaultProfile?.Id ?? "";

                tempOwner.Close();
            });

            return (allowed, displayName, profileId);
        }
        finally
        {
            _approvalLock.Release();
        }
    }

    // ================================================================
    // Dialogi
    // ================================================================

    private void ShowChangePortDialog()
    {
        using var form = new Form
        {
            Text            = "Zmien port",
            Size            = new Size(300, 150),
            FormBorderStyle = FormBorderStyle.FixedDialog,
            StartPosition   = FormStartPosition.CenterScreen,
            MaximizeBox     = false
        };
        var label  = new Label  { Text = "Port (1024-65535):", Location = new Point(12, 15), AutoSize = true };
        var input  = new TextBox{ Text = _config.Port.ToString(), Location = new Point(12, 38), Width = 260 };
        var btnOk  = new Button { Text = "OK",     Location = new Point(100, 72), Width = 80, DialogResult = DialogResult.OK };
        var btnCan = new Button { Text = "Anuluj", Location = new Point(190, 72), Width = 80, DialogResult = DialogResult.Cancel };
        form.Controls.AddRange([label, input, btnOk, btnCan]);
        form.AcceptButton = btnOk;
        form.CancelButton = btnCan;

        if (form.ShowDialog() == DialogResult.OK &&
            int.TryParse(input.Text, out int port) && port is >= 1024 and <= 65535)
        {
            _config.Port = port;
            _config.Save();
            _menuPort.Text = $"Port: {_config.Port}";
            _server.Restart();
            ShowBalloon($"Serwer zrestartowany na porcie {port}");
        }
    }

    private void ShowLog()
    {
        var text = _logLines.Count == 0 ? "(brak zdarzen)" : string.Join("\n", _logLines.TakeLast(100));
        var form = new Form
        {
            Text          = "Bookmark Sync - Log",
            Size          = new Size(620, 420),
            StartPosition = FormStartPosition.CenterScreen
        };
        var tb = new TextBox
        {
            Multiline  = true,
            ScrollBars = ScrollBars.Vertical,
            ReadOnly   = true,
            Dock       = DockStyle.Fill,
            Font       = new Font("Consolas", 9),
            Text       = text
        };
        form.Controls.Add(tb);
        form.Show();
    }

    private void ToggleAutostart(bool enable)
    {
        var startupFolder = Environment.GetFolderPath(Environment.SpecialFolder.Startup);
        var shortcut      = Path.Combine(startupFolder, "BookmarkSyncHost.lnk");
        if (enable) CreateShortcut(shortcut, Application.ExecutablePath);
        else if (File.Exists(shortcut)) File.Delete(shortcut);
        _config.Autostart = enable;
        _config.Save();
    }

    private static void CreateShortcut(string shortcutPath, string targetPath)
    {
        var script =
            $"$s=(New-Object -COM WScript.Shell).CreateShortcut('{shortcutPath}');" +
            $"$s.TargetPath='{targetPath}';" +
            $"$s.WorkingDirectory='{Path.GetDirectoryName(targetPath)}';" +
            $"$s.Save()";
        Process.Start(new ProcessStartInfo("powershell", $"-NoProfile -Command \"{script}\"")
        {
            CreateNoWindow = true, UseShellExecute = false
        })?.WaitForExit(3000);
    }

    private void OpenFolder(string path)
    {
        if (!string.IsNullOrWhiteSpace(path) && Directory.Exists(path))
            Process.Start("explorer.exe", path);
    }

    private void ExitApp()
    {
        _server.Stop();
        _trayIcon.Visible = false;
        Application.Exit();
    }

    private void ShowBalloon(string msg)
    {
        _trayIcon.BalloonTipTitle = "Bookmark Sync";
        _trayIcon.BalloonTipText  = msg;
        _trayIcon.BalloonTipIcon  = ToolTipIcon.Info;
        _trayIcon.ShowBalloonTip(3000);
    }

    private void ShowError(string msg) =>
        MessageBox.Show(msg, "Bookmark Sync", MessageBoxButtons.OK, MessageBoxIcon.Warning);

    private bool Confirm(string msg) =>
        MessageBox.Show(msg, "Bookmark Sync", MessageBoxButtons.YesNo, MessageBoxIcon.Question)
        == DialogResult.Yes;

    private static Icon CreateIcon()
    {
        using var bmp = new Bitmap(16, 16);
        using var g   = Graphics.FromImage(bmp);
        g.Clear(Color.Transparent);
        g.FillRectangle(new SolidBrush(Color.FromArgb(124, 106, 247)), 1, 1, 14, 14);
        g.DrawString("B", new Font("Arial", 8, FontStyle.Bold), Brushes.White, 2, 2);
        return Icon.FromHandle(bmp.GetHicon());
    }
}
