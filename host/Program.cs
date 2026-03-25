using BookmarkSyncHost;
using System.Windows.Forms;

[STAThread]
static void RunApp()
{
    using var mutex = new System.Threading.Mutex(
        true, "BookmarkSyncHost_SingleInstance", out bool isNew);
    if (!isNew)
    {
        MessageBox.Show(
            "Bookmark Sync Host jest juz uruchomiony.\nSprawdz zasobnik systemowy (prawy dolny rog).",
            "Bookmark Sync",
            MessageBoxButtons.OK,
            MessageBoxIcon.Information);
        return;
    }

    ApplicationConfiguration.Initialize();
    var config   = AppConfig.Load();
    var registry = new ClientRegistry(config);
    var server   = new HttpServer(config, registry);

    // Migracja — zapewnij token dla wszystkich profili
    foreach (var profile in config.Profiles)
    {
        if (!string.IsNullOrWhiteSpace(profile.Path))
        {
            try { TokenManager.EnsureToken(profile.Path); } catch { }
        }
    }

    server.Start();

    var hiddenForm = new Form
    {
        WindowState     = FormWindowState.Minimized,
        ShowInTaskbar   = false,
        Visible         = false,
        FormBorderStyle = FormBorderStyle.None,
        Size            = new Size(1, 1)
    };

    var tray = new TrayApp(config, server, registry, hiddenForm);
    hiddenForm.Show();
    hiddenForm.Hide();
    Application.Run(hiddenForm);
}

RunApp();
