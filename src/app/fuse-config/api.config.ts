export const apiConfig = {
    Api:
    {
      Main:
      {
        //Url: "https://api.dolar.net/api/"
        Url: "https://localhost:44366/api/"
      }
    },
    Services:
    {
        User:
        {
          Authenticate: "User/Authenticate",
          Register: "User/Register",
          UpdateUser: "User",
          ChangePassword: "User/ChangePassword",
          CheckEmail: "User/CheckEmail",
          GetAllUser: "User",
          DeleteUser: "User/Delete",
          GetById: "User/GetById"
        },
        Blog:
        {
          GetAll: "Blog/GetForAdmin",
          GetById: "Blog/GetById",
          Post: "Blog",
          Delete: "Blog/Delete"
        },
        Media:
        {
          GetAll: "Media",
          Post: "Media"
        },
        Audit:
        {
          GetAll: "Logs",
          GetById: "Logs/GetById",
          Post: "Logs"
        },
        Types:
        {
          GetActionTypes: "Types/GetActionTypes",
          GetCoinTypes: "Types/GetCoinTypes",
          GetCrudTypes: "Types/GetCrudTypes",
          GetLogTypes: "Types/GetLogTypes",
          GetPostCategoryTypes: "Types/GetPostCategoryTypes",
          GetPostStatusTypes: "Types/GetPostStatusTypes",
          GetRoleTypes: "Types/GetRoleTypes",
          GetServiceTypes: "Types/GetServiceTypes",
          GetUserStatusTypes: "Types/GetUserStatusTypes"
        }
    }
  };