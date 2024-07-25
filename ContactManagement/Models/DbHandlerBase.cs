

using Microsoft.Data.SqlClient;

namespace ContactManagement.Models
{
    public class DbHandlerBase
    {
        public static SqlConnection GetConnection()
        {
            string str = ConnectionStrings.DB_Conn_String;
            SqlConnection con = new SqlConnection(str);
            return con;
        }
    }
}
