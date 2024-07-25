namespace ContactManagement.Models
{
    public class ContactModel
    {
        public int ID { get; set; } //int
        public string? FIRSTNAME { get; set; } //varchar
        public string? LASTNAME { get; set; } //varchar
        public string? EMAIL { get; set; } //varchar
        public string? USERNAME { get; set; } //varchar
        public string? PASSWORD { get; set; } //varchar
        public string? CONFIRMPASSWORD { get; set; } //varchar
        public string? PHONENO { get; set; } //varchar
        public string? ADDRESS { get; set; } //varchar
        public string? ISFAVORATE { get; set; } //varchar
        public char ACTION { get; set; } //varchar
    }
}
