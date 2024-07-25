namespace ContactManagement.Models
{
    public class ReturnInfoModel
    {
        public int Status { get; set; } // 0 success, 1 warning , 2 error, 
        public bool Success { get; set; }
        public string? Message { get; set; }
    }
}
