namespace PetCareServicios.Config
{
    public class DatabaseConfig
    {
        public ConnectionStrings ConnectionStrings { get; set; } = new();
        public DatabaseSettings DatabaseSettings { get; set; } = new();
    }

    public class ConnectionStrings
    {
        public string Default { get; set; } = string.Empty;
        public string Development { get; set; } = string.Empty;
        public string Testing { get; set; } = string.Empty;
        public string Production { get; set; } = string.Empty;
    }

    public class DatabaseSettings
    {
        public int CommandTimeout { get; set; } = 30;
        public bool EnableRetryOnFailure { get; set; } = true;
        public int MaxRetryCount { get; set; } = 3;
        public int RetryDelay { get; set; } = 5;
    }
} 