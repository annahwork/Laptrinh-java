package uth.edu.controller;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import uth.edu.pojo.SCTechnician;
import uth.edu.pojo.User;
import uth.edu.service.UserService;

public class UserServlet extends HttpServlet {

    private UserService userService;
    private Gson gson;
    @Override
    public void init() throws ServletException {
        userService = new UserService();
        gson = new GsonBuilder()
                .excludeFieldsWithoutExposeAnnotation()
                .create();
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String pathInfo = req.getPathInfo(); // Lấy phần URL sau "/api/users"

        try {
            if (pathInfo == null || pathInfo.equals("/")) {
                // 1. Lấy tất cả Users ( /api/users )
                handleGetAllUsers(req, resp);
            } else if (pathInfo.equals("/technicians")) {
                // 2. Lấy Kỹ thuật viên ( /api/users/technicians )
                handleGetTechnicians(req, resp);
            } else {
                // 3. Lấy User theo ID ( /api/users/123 )
                handleGetUserById(req, resp, pathInfo);
            }
        } catch (Exception e) {
            e.printStackTrace();
            sendJsonError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Lỗi server nội bộ");
        }
    }

    /**
     * Xử lý các yêu cầu POST (Tạo mới / Đăng nhập)
     * POST /api/users/login -> Xử lý đăng nhập
     * POST /api/users -> Tạo User mới (ManageUserAccount)
     */
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String pathInfo = req.getPathInfo();
        String requestBody = readRequestBody(req);

        try {
            if (pathInfo != null && pathInfo.equals("/login")) {
                // 1. Xử lý Đăng nhập
                handleLogin(req, resp, requestBody);
            } else {
                // 2. Xử lý Tạo mới User
                handleManageUser(req, resp, requestBody, false); // false = Tạo mới
            }
        } catch (Exception e) {
            e.printStackTrace();
            sendJsonError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Lỗi server nội bộ");
        }
    }

    /**
     * Xử lý các yêu cầu PUT (Cập nhật)
     * PUT /api/users -> Cập nhật User (ManageUserAccount)
     */
    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String requestBody = readRequestBody(req);
        try {
            // Xử lý Cập nhật User
            handleManageUser(req, resp, requestBody, true); // true = Cập nhật
        } catch (Exception e) {
            e.printStackTrace();
            sendJsonError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Lỗi server nội bộ");
        }
    }

    // --- CÁC HÀM XỬ LÝ LOGIC (GET) ---

    private void handleGetAllUsers(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        int page = 1;
        try {
            String pageParam = req.getParameter("page");
            if (pageParam != null) {
                page = Integer.parseInt(pageParam);
            }
        } catch (NumberFormatException e) {
            // Bỏ qua, dùng page=1
        }

        List<User> users = userService.GetUsers(page);
        sendJsonResponse(resp, HttpServletResponse.SC_OK, users);
    }

    private void handleGetUserById(HttpServletRequest req, HttpServletResponse resp, String pathInfo) throws IOException {
        try {
            // pathInfo là "/123", ta cần lấy "123"
            Integer userId = Integer.parseInt(pathInfo.substring(1)); 
            User user = userService.GetUserProfile(userId);

            if (user != null) {
                sendJsonResponse(resp, HttpServletResponse.SC_OK, user);
            } else {
                sendJsonError(resp, HttpServletResponse.SC_NOT_FOUND, "Không tìm thấy người dùng");
            }
        } catch (NumberFormatException e) {
            sendJsonError(resp, HttpServletResponse.SC_BAD_REQUEST, "ID người dùng không hợp lệ");
        }
    }

    private void handleGetTechnicians(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        // Tạm thời, hàm GetTechnicians của bạn cần SCStaffID
        // Chúng ta nên lấy ID này từ session (đăng nhập) thay vì URL
        // Giả sử lấy từ SCStaff có ID = 1 (bạn cần sửa lại logic này)
        Integer scStaffID = 1; // Tạm thời hardcode

        List<SCTechnician> technicians = userService.GetTechnicians(scStaffID);
        sendJsonResponse(resp, HttpServletResponse.SC_OK, technicians);
    }

    // --- CÁC HÀM XỬ LÝ LOGIC (POST/PUT) ---

    private void handleLogin(HttpServletRequest req, HttpServletResponse resp, String requestBody) throws IOException {
        try {
            // Phân tích JSON body
            User loginAttempt = gson.fromJson(requestBody, User.class);
            
            User user = userService.Login(loginAttempt.getUserName(), loginAttempt.getPassword());

            if (user != null) {
                // ĐĂNG NHẬP THÀNH CÔNG
                // (Ở đây bạn nên tạo một HTTP Session để lưu user)
                // req.getSession().setAttribute("user", user); 
                
                sendJsonResponse(resp, HttpServletResponse.SC_OK, user);
            } else {
                sendJsonError(resp, HttpServletResponse.SC_UNAUTHORIZED, "Sai Username hoặc Password");
            }
        } catch (Exception e) {
            sendJsonError(resp, HttpServletResponse.SC_BAD_REQUEST, "Dữ liệu JSON không hợp lệ");
        }
    }

    private void handleManageUser(HttpServletRequest req, HttpServletResponse resp, String requestBody, boolean isUpdate) throws IOException {
        try {
            // Hàm ManageUserAccount của bạn cần 3 tham số
            // Chúng ta cần phân tích JSON phức tạp
            JsonObject jsonObject = JsonParser.parseString(requestBody).getAsJsonObject();

            Integer adminId = 1; // Giả sử Admin ID = 1 (bạn CẦN lấy từ Session)
            String role = jsonObject.get("role").getAsString();
            User userData = gson.fromJson(jsonObject.get("userData"), User.class);

            if (isUpdate) {
                // Đảm bảo ID được set cho logic Update
                Integer userIdToUpdate = Integer.parseInt(req.getPathInfo().substring(1)); // Lấy ID từ /api/users/5
                userData.setUserID(userIdToUpdate); 
            } else {
                userData.setUserID(0); // Đảm bảo ID là 0 cho logic Create
            }

            boolean success = userService.ManageUserAccount(adminId, userData, role);

            if (success) {
                if (isUpdate) {
                    sendJsonResponse(resp, HttpServletResponse.SC_OK, "Cập nhật thành công");
                } else {
                    sendJsonResponse(resp, HttpServletResponse.SC_CREATED, "Tạo mới thành công");
                }
            } else {
                sendJsonError(resp, HttpServletResponse.SC_BAD_REQUEST, "Thao tác thất bại, kiểm tra lại dữ liệu");
            }
        } catch (Exception e) {
            e.printStackTrace();
            sendJsonError(resp, HttpServletResponse.SC_BAD_REQUEST, "Dữ liệu JSON không hợp lệ");
        }
    }


    // --- CÁC HÀM TIỆN ÍCH ---

    /**
     * Gửi về một đối tượng JSON và mã HTTP
     */
    private void sendJsonResponse(HttpServletResponse resp, int statusCode, Object data) throws IOException {
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        resp.setStatus(statusCode);
        resp.getWriter().print(gson.toJson(data));
        resp.getWriter().flush();
    }

    /**
     * Gửi về một thông báo lỗi JSON
     */
    private void sendJsonError(HttpServletResponse resp, int statusCode, String message) throws IOException {
        JsonObject errorJson = new JsonObject();
        errorJson.addProperty("message", message);
        sendJsonResponse(resp, statusCode, errorJson);
    }

    /**
     * Đọc toàn bộ body của request và chuyển thành String
     */
    private String readRequestBody(HttpServletRequest request) throws IOException {
        return request.getReader().lines().collect(Collectors.joining(System.lineSeparator()));
    }
}