using ContactManagement.Models;
using Dapper;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Diagnostics;
using System.Text.RegularExpressions;

namespace ContactManagement.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            ContactModel model = new ContactModel();
            model.EMAIL = "/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/";
            return View(model);
        }
        [HttpPost]
        public IActionResult GetContactList(string searchEmail)
        {
            List<ContactModel> rtnValue = new List<ContactModel>();
            try
            {
                var con = DbHandlerBase.GetConnection();
                con.Open();

                var P = new DynamicParameters();
                P.Add("@P_SEARCHEMAIL", searchEmail ?? "");
                var query = con.QueryMultiple(sql: "PRC_GETCONTACTSLIST", P, commandType: System.Data.CommandType.StoredProcedure);

                rtnValue = query.Read<ContactModel>().ToList();

                con.Close();
            }
            catch (Exception)
            {

            }
            return Json(rtnValue);
        }

        [HttpPost]
        public IActionResult SaveUpdateContact(ContactModel item)
        {
            ReturnInfoModel returnInfoModel = new ReturnInfoModel();
            returnInfoModel.Success = false;
            if (item.ID == 0)
            {
                item.ACTION = 'I';
            }
            else
            {
                item.ACTION = 'U';
            }
            if (string.IsNullOrEmpty(item.FIRSTNAME))
            {
                returnInfoModel.Message = "Please Enter First Name";
                returnInfoModel.Status = 1;
                return Json(returnInfoModel);
            }
            if (string.IsNullOrEmpty(item.LASTNAME))
            {
                returnInfoModel.Message = "Please Enter Last Name";
                returnInfoModel.Status = 1;
                return Json(returnInfoModel);
            }
            if (string.IsNullOrEmpty(item.EMAIL))
            {
                returnInfoModel.Message = "Please Enter Email Id";
                returnInfoModel.Status = 1;
                return Json(returnInfoModel);
            }
            else
            {
                if (!IsValidEmail(item.EMAIL))
                {
                    returnInfoModel.Message = "Invalid email address";
                    returnInfoModel.Status = 1;
                    return Json(returnInfoModel);
                }
            }
            if (string.IsNullOrEmpty(item.USERNAME))
            {
                returnInfoModel.Message = "Please Enter Username";
                returnInfoModel.Status = 1;
                return Json(returnInfoModel);
            }
            if (string.IsNullOrEmpty(item.PASSWORD))
            {
                returnInfoModel.Message = "Please Enter Password";
                returnInfoModel.Status = 1;
                return Json(returnInfoModel);
            }
            if (string.IsNullOrEmpty(item.CONFIRMPASSWORD))
            {
                returnInfoModel.Message = "Please Enter Confirm Password";
                returnInfoModel.Status = 1;
                return Json(returnInfoModel);
            }
            if (item.PASSWORD != item.CONFIRMPASSWORD)
            {
                returnInfoModel.Message = "Passwords do not match";
                returnInfoModel.Status = 1;
                return Json(returnInfoModel);
            }
            if (string.IsNullOrEmpty(item.PHONENO))
            {
                returnInfoModel.Message = "Please Enter Phone Number";
                returnInfoModel.Status = 1;
                return Json(returnInfoModel);
            }
            else
            {
                if (!IsValidPhoneNumber(item.PHONENO))
                {
                    returnInfoModel.Message = "Invalid Phone Number";
                    returnInfoModel.Status = 1;
                    return Json(returnInfoModel);
                }
            }
            if (string.IsNullOrEmpty(item.ADDRESS))
            {
                returnInfoModel.Message = "Please Enter Address";
                returnInfoModel.Status = 1;
                return Json(returnInfoModel);
            }
            try
            {
                var con = DbHandlerBase.GetConnection();
                con.Open();

                var P = new DynamicParameters();
                P.Add("@P_ID", item.ID);
                P.Add("@P_FIRSTNAME", item.FIRSTNAME);
                P.Add("@P_LASTNAME", item.LASTNAME);
                P.Add("@P_EMAIL", item.EMAIL);
                P.Add("@P_USERNAME", item.USERNAME);
                P.Add("@P_PASSWORD", item.PASSWORD);
                P.Add("@P_CONFIRMPASSWORD", item.CONFIRMPASSWORD);
                P.Add("@P_PHONENO", item.PHONENO);
                P.Add("@P_ADDRESS", item.ADDRESS);
                P.Add("@P_ACTION", item.ACTION);
                P.Add("@P_ERRORMESSAGE", dbType: DbType.String, direction: ParameterDirection.Output, size: 255);

                con.Execute("PRC_INSERT_CONTACT", P, commandType: CommandType.StoredProcedure);
                string errorMessage = P.Get<string>("@P_ERRORMESSAGE");

                if (string.IsNullOrEmpty(errorMessage))
                {
                    if (item.ACTION == 'I')
                    {
                        returnInfoModel.Message = "Added";
                        returnInfoModel.Success = true;
                    }
                    else
                    {
                        returnInfoModel.Message = "Updated";
                        returnInfoModel.Success = true;
                    }
                }
                else
                {
                    returnInfoModel.Message = errorMessage;
                    returnInfoModel.Status = 1;
                    returnInfoModel.Success = false;
                }
                con.Close();
            }
            catch (Exception ex)
            {
                returnInfoModel.Message = ex.Message;
                returnInfoModel.Status = 2;
                returnInfoModel.Success = false;
            }
            return Json(returnInfoModel);
        }
        static bool IsValidEmail(string email)
        {
            string emailPattern = @"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$";
            Regex regex = new Regex(emailPattern);
            return regex.IsMatch(email);
        }
        static bool IsValidPhoneNumber(string number)
        {
            string phonePattern = @"^(?:\+91|91)?(?:\d{10}|\d{2,5}-\d{6,8})$";
            Regex regex = new Regex(phonePattern);
            return regex.IsMatch(number);
        }
        [HttpPost]
        public IActionResult DeleteContact(int ID)
        {
            ReturnInfoModel returnInfoModel = new ReturnInfoModel();
            returnInfoModel.Success = false;
            try
            {
                var con = DbHandlerBase.GetConnection();
                con.Open();

                var P = new DynamicParameters();
                P.Add("@P_ID", ID);
                con.Execute("PRC_DELETE_CONTACT", P, commandType: CommandType.StoredProcedure);

                returnInfoModel.Message = "Contact Deleted Successfully.";
                returnInfoModel.Success = true;
                con.Close();
            }
            catch (Exception ex)
            {
                returnInfoModel.Message = ex.Message;
                returnInfoModel.Success = false;
            }
            return Json(returnInfoModel);
        }
        [HttpPost]
        public IActionResult GetSingleContact(int Id)
        {
            ContactModel ContactModel = new ContactModel();
            try
            {
                var con = DbHandlerBase.GetConnection();
                con.Open();

                var P = new DynamicParameters();
                string sqlQuery = "SELECT * FROM TBL_CONTACT WHERE ID=" + Id;
                // Execute the query and retrieve the data
                ContactModel = con.Query<ContactModel>(sqlQuery).Single();
                con.Close();
            }
            catch (Exception)
            {
            }
            return Json(ContactModel);
        }
        [HttpPost]
        public IActionResult SetFavorateContact(int Id, int IsFavorate)
        {
            ReturnInfoModel returnInfoModel = new ReturnInfoModel();
            returnInfoModel.Success = false;
            try
            {
                var con = DbHandlerBase.GetConnection();
                con.Open();

                string SqlQuery = "UPDATE TBL_CONTACT SET ISFAVORATE = {0} WHERE ID = {1}";
                con.Execute(String.Format(SqlQuery , IsFavorate, Id));

                returnInfoModel.Message = "";
                returnInfoModel.Success = true;
                con.Close();
            }
            catch (Exception ex)
            {
                returnInfoModel.Message = ex.Message;
                returnInfoModel.Success = false;
            }
            return Json(returnInfoModel);
        }
        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
