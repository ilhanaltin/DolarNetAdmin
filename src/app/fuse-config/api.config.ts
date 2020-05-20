export const apiConfig = {
    Api:
    {
      Main:
      {
        Url: "https://api.dolar.net/api/"
        //Url: "https://localhost:44366/api/"
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
          DeleteSelected: "User/DeleteSelected",
          GetById: "User/GetById",
          Contact: "User/Contact",
          ContactList: "User/ContactList",
          DeleteContactMessage: "User/DeleteContactMessage"
        },
        Blog:
        {
          GetAll: "Blog/GetForAdmin",
          GetById: "Blog/GetById",
          Post: "Blog",
          Delete: "Blog/Delete",
          GetComments: "Blog/GetComments",
          CommentStatusUpdate: "Blog/CommentStatusUpdate",
          DeleteComment: "Blog/DeleteComment"
        },
        Media:
        {
          GetAll: "Media",
          Post: "Media",
          DeleteMedia: "Media/DeleteMedia"
        },
        Currency:
        {
          GetComments: "Currency/GetComments",
          CommentStatusUpdate: "Currency/CommentStatusUpdate",
          DeleteComment: "Currency/DeleteComment"          
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