import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Lock, X, Eye, EyeOff } from "lucide-react";

// Component chính
const App = () => {
  const [currentPage, setCurrentPage] = useState("inventory");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleAdminClick = () => {
    if (isAuthenticated) {
      setCurrentPage("admin");
    } else {
      setShowLoginModal(true);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (
      loginData.username === "phongnh5" &&
      loginData.password === "phongnh5"
    ) {
      setIsAuthenticated(true);
      setCurrentPage("admin");
      setShowLoginModal(false);
      setLoginError("");
      setLoginData({ username: "", password: "" });
    } else {
      setLoginError("Tên đăng nhập hoặc mật khẩu không đúng!");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage("inventory");
  };

  const closeModal = () => {
    setShowLoginModal(false);
    setLoginError("");
    setLoginData({ username: "", password: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-20">
        <div className="container mx-auto flex flex-wrap items-center justify-between py-4 px-6">
          <img
            src="https://fpt.vn/fontend_v2.0_2024/assets/images/fpt-logo.svg"
            alt="FPT Logo"
            className="h-8"
          />
          <h1 className="text-2xl font-extrabold text-blue-700">
            Phân Tích Tồn Ca Vụ HCM
          </h1>
          <div className="flex space-x-3 items-center">
            <button
              onClick={() => setCurrentPage("inventory")}
              className={`
                px-4 py-2 text-sm font-medium rounded-lg
                transition-colors duration-200
                ${
                  currentPage === "inventory"
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                }
              `}
            >
              Trang Tồn
            </button>
            <button
              onClick={handleAdminClick}
              className={`
                flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg
                transition-colors duration-200
                ${
                  currentPage === "admin"
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                }
              `}
            >
              <Lock className="w-4 h-4" />
              Trang Admin
            </button>
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors duration-200"
              >
                Đăng Xuất
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Lock className="w-6 h-6 text-blue-600" />
                Đăng Nhập Admin
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên đăng nhập
                </label>
                <input
                  type="text"
                  value={loginData.username}
                  onChange={(e) =>
                    setLoginData({ ...loginData, username: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Nhập tên đăng nhập"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({ ...loginData, password: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pr-12"
                    placeholder="Nhập mật khẩu"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {loginError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {loginError}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                >
                  Đăng Nhập
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Content */}
      <main className="container mx-auto py-8 px-6">
        {currentPage === "inventory" ? (
          <InventoryDashboard />
        ) : (
          <AdminDashboard />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="container mx-auto py-4 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} PhongNH5 All rights reserved.
        </div>
      </footer>
    </div>
  );
};

// Component trang Admin
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("personnel");
  const [personnelData, setPersonnelData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form states for personnel
  const [newPersonnel, setNewPersonnel] = useState({
    nhanSu: "",
    block: "",
    doiTac: "",
  });

  // Form states for status
  const [newStatus, setNewStatus] = useState({
    tinhTrang: "",
    loaiCls: "",
  });

  // JSONBin API configuration
  const apiKey = "$2a$10$dxJzzGFLNbMgbXsbVbvj8e/RW7gf2roGVn0xCgG9yv1QzqacqPZS2";
  const personnelBinId = "686662c68960c979a5b65a7a";
  const statusBinId = "6866633b8a456b7966ba96aa";

  const API_PERSONNEL = `https://api.jsonbin.io/v3/b/${personnelBinId}`;
  const API_STATUS = `https://api.jsonbin.io/v3/b/${statusBinId}`;

  // Load data on component mount
  useEffect(() => {
    loadPersonnelData();
    loadStatusData();
  }, []);

  // Load personnel data
  const loadPersonnelData = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_PERSONNEL, {
        headers: {
          "X-Master-Key": apiKey,
        },
      });
      const result = await response.json();
      setPersonnelData(result.record || []);
    } catch (error) {
      console.error("Error loading personnel data:", error);
      setError("Lỗi tải dữ liệu nhân sự");
    } finally {
      setLoading(false);
    }
  };

  // Load status data
  const loadStatusData = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_STATUS, {
        headers: {
          "X-Master-Key": apiKey,
        },
      });
      const result = await response.json();
      setStatusData(result.record || []);
    } catch (error) {
      console.error("Error loading status data:", error);
      setError("Lỗi tải dữ liệu tình trạng");
    } finally {
      setLoading(false);
    }
  };

  // Add new personnel
  const addPersonnel = async () => {
    if (!newPersonnel.nhanSu || !newPersonnel.block || !newPersonnel.doiTac) {
      setError("Vui lòng điền đầy đủ thông tin nhân sự");
      return;
    }

    try {
      setLoading(true);

      // Create new personnel with ID
      const newPersonnelWithId = {
        ...newPersonnel,
        id: Date.now().toString(), // Simple ID generation
      };

      // Add to existing data
      const updatedData = [...personnelData, newPersonnelWithId];

      const response = await fetch(API_PERSONNEL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Master-Key": apiKey,
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        await loadPersonnelData();
        setNewPersonnel({ nhanSu: "", block: "", doiTac: "" });
        setError(null);
      } else {
        setError("Lỗi thêm nhân sự");
      }
    } catch (error) {
      console.error("Error adding personnel:", error);
      setError("Lỗi thêm nhân sự");
    } finally {
      setLoading(false);
    }
  };

  // Add new status
  const addStatus = async () => {
    if (!newStatus.tinhTrang || !newStatus.loaiCls) {
      setError("Vui lòng điền đầy đủ thông tin tình trạng");
      return;
    }

    try {
      setLoading(true);

      // Create new status with ID
      const newStatusWithId = {
        ...newStatus,
        id: Date.now().toString(), // Simple ID generation
      };

      // Add to existing data
      const updatedData = [...statusData, newStatusWithId];

      const response = await fetch(API_STATUS, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Master-Key": apiKey,
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        await loadStatusData();
        setNewStatus({ tinhTrang: "", loaiCls: "" });
        setError(null);
      } else {
        setError("Lỗi thêm tình trạng");
      }
    } catch (error) {
      console.error("Error adding status:", error);
      setError("Lỗi thêm tình trạng");
    } finally {
      setLoading(false);
    }
  };

  // Import personnel from Excel
  const handlePersonnelImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (jsonData.length <= 1) {
        setError("File Excel không có dữ liệu");
        return;
      }

      // Skip header row and process data
      const dataRows = jsonData.slice(1);
      const newPersonnelList = [];

      for (const row of dataRows) {
        if (row.length >= 3 && row[0] && row[1] && row[2]) {
          newPersonnelList.push({
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            nhanSu: row[0].toString(),
            block: row[1].toString(),
            doiTac: row[2].toString(),
          });
        }
      }

      if (newPersonnelList.length > 0) {
        // Combine with existing data
        const updatedData = [...personnelData, ...newPersonnelList];

        const response = await fetch(API_PERSONNEL, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "X-Master-Key": apiKey,
          },
          body: JSON.stringify(updatedData),
        });

        if (response.ok) {
          await loadPersonnelData();
          setError(null);
          alert(`Đã import thành công ${newPersonnelList.length} nhân sự`);
        } else {
          setError("Lỗi import dữ liệu");
        }
      }
    } catch (error) {
      console.error("Error importing personnel:", error);
      setError("Lỗi import file Excel");
    } finally {
      setLoading(false);
    }
  };

  // Import status from Excel
  const handleStatusImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (jsonData.length <= 1) {
        setError("File Excel không có dữ liệu");
        return;
      }

      // Skip header row and process data
      const dataRows = jsonData.slice(1);
      const newStatusList = [];

      for (const row of dataRows) {
        if (row.length >= 2 && row[0] && row[1]) {
          newStatusList.push({
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            tinhTrang: row[0].toString(),
            loaiCls: row[1].toString(),
          });
        }
      }

      if (newStatusList.length > 0) {
        // Combine with existing data
        const updatedData = [...statusData, ...newStatusList];

        const response = await fetch(API_STATUS, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "X-Master-Key": apiKey,
          },
          body: JSON.stringify(updatedData),
        });

        if (response.ok) {
          await loadStatusData();
          setError(null);
          alert(`Đã import thành công ${newStatusList.length} tình trạng`);
        } else {
          setError("Lỗi import dữ liệu");
        }
      }
    } catch (error) {
      console.error("Error importing status:", error);
      setError("Lỗi import file Excel");
    } finally {
      setLoading(false);
    }
  };

  // Export personnel to Excel
  const exportPersonnelToExcel = () => {
    if (personnelData.length === 0) {
      setError("Không có dữ liệu để xuất");
      return;
    }

    const exportData = personnelData.map((item) => ({
      "Nhân Sự": item.nhanSu,
      Block: item.block,
      "Đối Tác": item.doiTac,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Nhân Sự");

    const fileName = `Danh_Sach_Nhan_Su_${new Date()
      .toISOString()
      .slice(0, 10)}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  // Export status to Excel
  const exportStatusToExcel = () => {
    if (statusData.length === 0) {
      setError("Không có dữ liệu để xuất");
      return;
    }

    const exportData = statusData.map((item) => ({
      "Tình Trạng": item.tinhTrang,
      "Loại Cls": item.loaiCls,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tình Trạng");

    const fileName = `Danh_Sach_Tinh_Trang_${new Date()
      .toISOString()
      .slice(0, 10)}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  // Delete personnel
  const deletePersonnel = async (id) => {
    if (!confirm("Bạn có chắc chắn muốn xóa nhân sự này?")) return;

    try {
      setLoading(true);

      // Filter out the item to delete
      const updatedData = personnelData.filter((item) => item.id !== id);

      const response = await fetch(API_PERSONNEL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Master-Key": apiKey,
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        await loadPersonnelData();
        setError(null);
      } else {
        setError("Lỗi xóa nhân sự");
      }
    } catch (error) {
      console.error("Error deleting personnel:", error);
      setError("Lỗi xóa nhân sự");
    } finally {
      setLoading(false);
    }
  };

  // Delete status
  const deleteStatus = async (id) => {
    if (!confirm("Bạn có chắc chắn muốn xóa tình trạng này?")) return;

    try {
      setLoading(true);

      // Filter out the item to delete
      const updatedData = statusData.filter((item) => item.id !== id);

      const response = await fetch(API_STATUS, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Master-Key": apiKey,
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        await loadStatusData();
        setError(null);
      } else {
        setError("Lỗi xóa tình trạng");
      }
    } catch (error) {
      console.error("Error deleting status:", error);
      setError("Lỗi xóa tình trạng");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Trang Quản Trị</h1>

      {/* Error display */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
          <button
            className="mt-2 text-sm text-red-800 underline"
            onClick={() => setError(null)}
          >
            Đóng
          </button>
        </div>
      )}

      {/* Tab navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("personnel")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "personnel"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Quản Lý Nhân Sự
            </button>
            <button
              onClick={() => setActiveTab("status")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "status"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Quản Lý Tình Trạng
            </button>
          </nav>
        </div>
      </div>

      {/* Personnel Management Tab */}
      {activeTab === "personnel" && (
        <div className="space-y-6">
          {/* Add Personnel Form */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Thêm Nhân Sự Mới</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Nhân Sự
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={newPersonnel.nhanSu}
                  onChange={(e) =>
                    setNewPersonnel({ ...newPersonnel, nhanSu: e.target.value })
                  }
                  placeholder="Tên nhân sự"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Block</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={newPersonnel.block}
                  onChange={(e) =>
                    setNewPersonnel({ ...newPersonnel, block: e.target.value })
                  }
                  placeholder="Tên block"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Đối Tác
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={newPersonnel.doiTac}
                  onChange={(e) =>
                    setNewPersonnel({ ...newPersonnel, doiTac: e.target.value })
                  }
                  placeholder="Tên đối tác"
                />
              </div>
            </div>
            <button
              onClick={addPersonnel}
              disabled={loading}
              className={`px-4 py-2 rounded text-white ${
                loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {loading ? "Đang thêm..." : "Thêm Nhân Sự"}
            </button>
          </div>

          {/* Import/Export Personnel */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">
              Import/Export Nhân Sự
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Import từ Excel (3 cột: Nhân Sự, Block, Đối Tác)
                </label>
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handlePersonnelImport}
                  className="w-full p-2 border rounded"
                  disabled={loading}
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={exportPersonnelToExcel}
                  disabled={loading || personnelData.length === 0}
                  className={`px-4 py-2 rounded text-white ${
                    loading || personnelData.length === 0
                      ? "bg-gray-400"
                      : "bg-green-500 hover:bg-green-600"
                  }`}
                >
                  Xuất Excel
                </button>
              </div>
            </div>
          </div>

          {/* Personnel List */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">
              Danh Sách Nhân Sự ({personnelData.length} nhân sự)
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Nhân Sự
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Block
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Đối Tác
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Hành Động
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {personnelData.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.nhanSu}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.block}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.doiTac}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => deletePersonnel(item.id)}
                          className="text-red-600 hover:text-red-900"
                          disabled={loading}
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Status Management Tab */}
      {activeTab === "status" && (
        <div className="space-y-6">
          {/* Add Status Form */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Thêm Tình Trạng Mới</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Tình Trạng
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={newStatus.tinhTrang}
                  onChange={(e) =>
                    setNewStatus({ ...newStatus, tinhTrang: e.target.value })
                  }
                  placeholder="Tình trạng lỗi"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Loại Cls
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={newStatus.loaiCls}
                  onChange={(e) =>
                    setNewStatus({ ...newStatus, loaiCls: e.target.value })
                  }
                  placeholder="Loại bảo trì"
                />
              </div>
            </div>
            <button
              onClick={addStatus}
              disabled={loading}
              className={`px-4 py-2 rounded text-white ${
                loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {loading ? "Đang thêm..." : "Thêm Tình Trạng"}
            </button>
          </div>

          {/* Import/Export Status */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">
              Import/Export Tình Trạng
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Import từ Excel (2 cột: Tình Trạng, Loại Cls)
                </label>
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleStatusImport}
                  className="w-full p-2 border rounded"
                  disabled={loading}
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={exportStatusToExcel}
                  disabled={loading || statusData.length === 0}
                  className={`px-4 py-2 rounded text-white ${
                    loading || statusData.length === 0
                      ? "bg-gray-400"
                      : "bg-green-500 hover:bg-green-600"
                  }`}
                >
                  Xuất Excel
                </button>
              </div>
            </div>
          </div>

          {/* Status List */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">
              Danh Sách Tình Trạng ({statusData.length} tình trạng)
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Tình Trạng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Loại Cls
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Hành Động
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {statusData.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.tinhTrang}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.loaiCls}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => deleteStatus(item.id)}
                          className="text-red-600 hover:text-red-900"
                          disabled={loading}
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Component trang Inventory (đã cập nhật để tích hợp với API)
const InventoryDashboard = () => {
  // Quản lý state
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [hierarchicalData, setHierarchicalData] = useState([]);
  const [partners, setPartners] = useState([]);
  const [regions, setRegions] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [availableDates, setAvailableDates] = useState([]);
  const [summaryData, setSummaryData] = useState({
    totalInventory: 0,
    newDeployment: 0,
    relocation: 0,
    swap: 0,
    maintenancePhysical: 0,
    maintenanceLogical: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [excelLoaded, setExcelLoaded] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [expandedItems, setExpandedItems] = useState({
    partners: {},
    blocks: {},
  });

  // State cho việc quản lý nhiều file
  const [uploadedFiles, setUploadedFiles] = useState({
    tonTrienKhai: null,
    tonBaoTri: null,
    lichTruc: null,
  });

  // State cho dữ liệu bảo trì và lịch trực
  const [maintenanceData, setMaintenanceData] = useState([]);
  const [dutyScheduleData, setDutyScheduleData] = useState([]);

  // State cho dữ liệu từ API
  const [personnelMappingData, setPersonnelMappingData] = useState([]);
  const [statusMappingData, setStatusMappingData] = useState([]);

  // Flag để kiểm tra xem đã upload đủ file chưa
  const [allFilesUploaded, setAllFilesUploaded] = useState(false);

  // JSONBin API configuration
  const apiKey = "$2a$10$dxJzzGFLNbMgbXsbVbvj8e/RW7gf2roGVn0xCgG9yv1QzqacqPZS2";
  const personnelBinId = "686662c68960c979a5b65a7a";
  const statusBinId = "6866633b8a456b7966ba96aa";

  const API_PERSONNEL = `https://api.jsonbin.io/v3/b/${personnelBinId}`;
  const API_STATUS = `https://api.jsonbin.io/v3/b/${statusBinId}`;

  // Load dữ liệu mapping từ API
  useEffect(() => {
    loadPersonnelMapping();
    loadStatusMapping();
  }, []);

  const loadPersonnelMapping = async () => {
    try {
      const response = await fetch(API_PERSONNEL, {
        headers: {
          "X-Master-Key": apiKey,
        },
      });
      const result = await response.json();
      setPersonnelMappingData(result.record || []);
    } catch (error) {
      console.error("Error loading personnel mapping:", error);
    }
  };

  const loadStatusMapping = async () => {
    try {
      const response = await fetch(API_STATUS, {
        headers: {
          "X-Master-Key": apiKey,
        },
      });
      const result = await response.json();
      setStatusMappingData(result.record || []);
    } catch (error) {
      console.error("Error loading status mapping:", error);
    }
  };

  // Xác định hàm sắp xếp
  const sortData = (data, key, direction) => {
    if (!key) return data;

    return [...data].sort((a, b) => {
      // Chuyển đổi dữ liệu thành số nếu cần
      let valueA = typeof a[key] === "string" ? a[key].toLowerCase() : a[key];
      let valueB = typeof b[key] === "string" ? b[key].toLowerCase() : b[key];

      // Nếu là đối tác, sắp xếp theo số
      if (key === "partner") {
        const numA = parseInt(valueA.match(/\d+/) || [0]);
        const numB = parseInt(valueB.match(/\d+/) || [0]);
        return direction === "ascending" ? numA - numB : numB - numA;
      }

      // Sắp xếp thông thường
      if (valueA < valueB) {
        return direction === "ascending" ? -1 : 1;
      }
      if (valueA > valueB) {
        return direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  };

  // Kiểm tra xem đã upload đủ file cần thiết chưa
  useEffect(() => {
    if (
      uploadedFiles.tonTrienKhai &&
      (uploadedFiles.tonBaoTri || maintenanceData.length > 0) &&
      (uploadedFiles.lichTruc || dutyScheduleData.length > 0)
    ) {
      setAllFilesUploaded(true);
    } else {
      setAllFilesUploaded(false);
    }
  }, [uploadedFiles, maintenanceData.length, dutyScheduleData.length]);

  // Lọc dữ liệu khi bộ lọc thay đổi
  useEffect(() => {
    if (data.length > 0) {
      applyFilters();
    }
  }, [
    data,
    selectedPartner,
    selectedRegion,
    startDate,
    endDate,
    sortConfig,
    maintenanceData,
    dutyScheduleData,
  ]);

  // Hàm để tìm thông tin nhân sự từ API
  const findPersonnelInfo = (personnelName) => {
    if (!personnelName || personnelMappingData.length === 0) return null;

    const personnel = personnelMappingData.find(
      (p) =>
        p.nhanSu &&
        p.nhanSu.toString().toLowerCase() ===
          personnelName.toString().toLowerCase()
    );

    return personnel;
  };

  // Hàm để xác định loại bảo trì từ tình trạng
  const getMaintenanceType = (tinhTrang) => {
    if (!tinhTrang || statusMappingData.length === 0)
      return "maintenanceLogical";

    const status = statusMappingData.find(
      (s) =>
        s.tinhTrang &&
        s.tinhTrang.toString().toLowerCase() ===
          tinhTrang.toString().toLowerCase()
    );

    if (status && status.loaiCls) {
      return status.loaiCls.toString().toLowerCase().includes("vật lý")
        ? "maintenancePhysical"
        : "maintenanceLogical";
    }

    return "maintenanceLogical";
  };

  // Xử lý import file Excel
  const handleFileImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      // Xác định loại file dựa trên tên file và nội dung
      const fileName = file.name.toLowerCase();
      console.log("Importing file:", fileName);

      // Đọc một phần đầu file để xác định loại
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, {
        type: "array",
        cellDates: true,
        cellStyles: true,
        cellFormulas: true,
      });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const sampleData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        range: 0,
      });

      // Thử xác định loại file dựa trên header
      if (sampleData && sampleData.length > 0) {
        const headers = sampleData[0];
        console.log("File headers:", headers);

        // Kiểm tra xem có phải file triển khai không
        if (
          headers.some((h) => h && h.toString().includes("TG Hẹn xanh")) ||
          headers.some((h) => h && h.toString().includes("Loại triển khai"))
        ) {
          console.log("Detected as deployment file");
          await processExcelFile(file, "tonTrienKhai", workbook);
        }
        // Kiểm tra xem có phải file bảo trì không
        else if (
          headers.some(
            (h) => h && h.toString().includes("Ngày Hẹn - Lần Hẹn(Xanh)")
          ) ||
          headers.some((h) => h && h.toString().includes("Tình trạng")) ||
          fileName.includes("bao_tri") ||
          fileName.includes("bảo trì")
        ) {
          console.log("Detected as maintenance file");
          await processMaintenanceFile(file, workbook);
        }
        // Kiểm tra xem có phải file lịch trực không
        else if (
          headers.some((h) => h && h === "CA1") ||
          headers.some((h) => h && h === "O") ||
          fileName.includes("lich_truc") ||
          fileName.includes("lịch trực")
        ) {
          console.log("Detected as duty schedule file");
          await processDutyScheduleFile(file, workbook);
        }
        // Nếu không xác định được, dựa vào tên file
        else if (
          fileName.includes("trien_khai") ||
          fileName.includes("triển khai")
        ) {
          console.log("Detected as deployment file based on filename");
          await processExcelFile(file, "tonTrienKhai", workbook);
        } else {
          console.log("Could not detect file type, using filename as fallback");
          if (fileName.includes("bao_tri") || fileName.includes("bảo trì")) {
            await processMaintenanceFile(file, workbook);
          } else if (
            fileName.includes("lich_truc") ||
            fileName.includes("lịch trực")
          ) {
            await processDutyScheduleFile(file, workbook);
          } else {
            // Mặc định xử lý như file triển khai
            await processExcelFile(file, "tonTrienKhai", workbook);
          }
        }
      }

      setLoading(false);
    } catch (error) {
      console.error("Lỗi xử lý file Excel:", error);
      setError(`Lỗi xử lý file Excel: ${error.message}`);
      setLoading(false);
    }
  };

  // Phân tích và xử lý file triển khai
  const processExcelFile = async (file, fileType, existingWorkbook = null) => {
    try {
      let workbook = existingWorkbook;
      if (!workbook) {
        const arrayBuffer = await file.arrayBuffer();
        workbook = XLSX.read(arrayBuffer, {
          type: "array",
          cellDates: true,
          cellStyles: true,
          cellFormulas: true,
        });
      }

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (jsonData.length <= 1) {
        throw new Error("File Excel không có dữ liệu");
      }

      // Lấy header
      const headers = jsonData[0];
      console.log("Processing deployment file with headers:", headers);

      // Tìm vị trí các cột quan trọng
      const doiTacIdx = findColumnIndex(headers, "Đối tác");
      const blockIdx = findColumnIndex(headers, "Block");
      const blockNhanSuIdx = findColumnIndex(headers, "Block nhân sự");
      const nhanSuIdx = findColumnIndex(headers, "Nhân sự");
      const tgHenXanhIdx = findColumnIndex(headers, "TG Hẹn xanh");
      const tgHenDoIdx = findColumnIndex(headers, "TG Hẹn đỏ");
      const loaiTrienKhaiIdx = findColumnIndex(headers, "Loại triển khai");
      const vungIdx = findColumnIndex(headers, "Vùng");
      const tinhThanhIdx = findColumnIndex(headers, "Tỉnh thành");

      // Kiểm tra các cột bắt buộc
      if (doiTacIdx === -1 || (tgHenXanhIdx === -1 && tgHenDoIdx === -1)) {
        throw new Error("File Excel không có cột Đối tác hoặc TG Hẹn");
      }

      // Chuẩn hóa dữ liệu
      const normalizedData = [];

      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i];
        if (!row || row.length === 0) continue;

        // Lấy ngày từ TG Hẹn xanh hoặc TG Hẹn đỏ
        let dateValue = "";
        if (
          tgHenXanhIdx !== -1 &&
          row[tgHenXanhIdx] &&
          row[tgHenXanhIdx].toString().trim() !== ""
        ) {
          dateValue = formatDate(row[tgHenXanhIdx]);
        } else if (
          tgHenDoIdx !== -1 &&
          row[tgHenDoIdx] &&
          row[tgHenDoIdx].toString().trim() !== ""
        ) {
          dateValue = formatDate(row[tgHenDoIdx]);
        }

        if (!dateValue) continue; // Bỏ qua các dòng không có ngày

        // Xác định loại triển khai
        let deploymentType = "other";
        if (loaiTrienKhaiIdx !== -1 && row[loaiTrienKhaiIdx]) {
          const loaiTK = row[loaiTrienKhaiIdx].toString().toLowerCase();
          if (loaiTK.includes("triển khai mới")) {
            deploymentType = "newDeployment";
          } else if (loaiTK.includes("chuyển địa điểm")) {
            deploymentType = "relocation";
          } else if (loaiTK.includes("swap")) {
            deploymentType = "swap";
          }
        }

        // Lấy thông tin nhân sự và tìm kiếm trong API
        const personnelName =
          nhanSuIdx !== -1 ? (row[nhanSuIdx] || "").toString() : "";
        const personnelInfo = findPersonnelInfo(personnelName);

        // Sử dụng thông tin từ API nếu có, nếu không thì dùng dữ liệu từ file
        let partnerFromAPI = "";
        let blockFromAPI = "";

        if (personnelInfo) {
          partnerFromAPI = personnelInfo.doiTac || "";
          blockFromAPI = personnelInfo.block || "";
        }

        // Ưu tiên thông tin từ API, sau đó từ file
        const finalPartner =
          partnerFromAPI ||
          (doiTacIdx !== -1 ? (row[doiTacIdx] || "").toString() : "");
        const finalBlock =
          blockFromAPI ||
          (blockIdx !== -1 ? (row[blockIdx] || "").toString() : "");

        // Lấy thông tin khu vực
        const region = vungIdx !== -1 ? (row[vungIdx] || "").toString() : "";
        const province =
          tinhThanhIdx !== -1 ? (row[tinhThanhIdx] || "").toString() : "";

        // Tạo item dữ liệu
        normalizedData.push({
          partner: finalPartner,
          block: finalBlock,
          blockNhanSu:
            blockNhanSuIdx !== -1 ? (row[blockNhanSuIdx] || "").toString() : "",
          personnel: personnelName,
          date: dateValue,
          region: region,
          province: province,
          deploymentType: deploymentType,
          rawData: row, // Lưu dữ liệu gốc để xuất file
        });
      }

      // Tổng hợp dữ liệu theo ngày, đối tác, block, nhân sự và loại triển khai
      const aggregatedData = aggregateData(normalizedData);

      // Cập nhật state
      setData(aggregatedData);

      // Cập nhật uploadedFiles state
      setUploadedFiles((prev) => ({
        ...prev,
        [fileType]: file,
      }));

      // Trích xuất danh sách đối tác, khu vực và ngày duy nhất
      const uniquePartners = [
        ...new Set(aggregatedData.map((item) => item.partner)),
      ].filter(Boolean);
      const uniqueRegions = [
        ...new Set(aggregatedData.map((item) => item.region)),
      ].filter(Boolean);
      const uniqueDates = [...new Set(aggregatedData.map((item) => item.date))]
        .filter(Boolean)
        .sort();

      // Sắp xếp đối tác theo số (từ 1 đến 16)
      uniquePartners.sort((a, b) => {
        const numA = parseInt(a.match(/\d+/) || [0]);
        const numB = parseInt(b.match(/\d+/) || [0]);
        return numA - numB;
      });

      setPartners(uniquePartners);
      setRegions(uniqueRegions);
      setAvailableDates(uniqueDates);

      if (uniqueDates.length > 0) {
        // Mặc định chọn ngày đầu tiên và cuối cùng
        setStartDate(uniqueDates[0]);
        setEndDate(uniqueDates[uniqueDates.length - 1]);
      }

      // Tạo cấu trúc dữ liệu phân cấp
      createHierarchicalData(aggregatedData);

      // Khởi tạo trạng thái mở rộng cho mỗi đối tác
      const initialExpandedPartners = {};
      uniquePartners.forEach((partner) => {
        initialExpandedPartners[partner] = false; // Mặc định là thu gọn
      });

      setExpandedItems({
        partners: initialExpandedPartners,
        blocks: {},
      });

      setExcelLoaded(true);

      return true;
    } catch (error) {
      console.error("Lỗi xử lý file triển khai:", error);
      setError(`Lỗi xử lý file triển khai: ${error.message}`);
      return false;
    }
  };

  // Phân tích và xử lý file bảo trì (đã cập nhật để sử dụng API)
  const processMaintenanceFile = async (file, existingWorkbook = null) => {
    try {
      let workbook = existingWorkbook;
      if (!workbook) {
        const arrayBuffer = await file.arrayBuffer();
        workbook = XLSX.read(arrayBuffer, {
          type: "array",
          cellDates: true,
          cellStyles: true,
          cellFormulas: true,
        });
      }

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (jsonData.length <= 1) {
        throw new Error("File bảo trì không có dữ liệu");
      }

      // Lấy header
      const headers = jsonData[0];
      console.log("Processing maintenance file with headers:", headers);

      // Tìm vị trí các cột quan trọng
      const doiTacIdx = findColumnIndex(headers, "Đối tác");
      const blockIdx = findColumnIndex(headers, "Block");
      const blockNhanSuIdx = findColumnIndex(headers, "Block nhân sự");
      const nhanSuIdx = findColumnIndex(headers, "Nhân sự");
      const tinhTrangIdx = findColumnIndex(headers, "Tình trạng");
      const ngayHenXanhIdx = findColumnIndex(
        headers,
        "Ngày Hẹn - Lần Hẹn(Xanh)"
      );
      const ngayHenDoIdx = findColumnIndex(headers, "Ngày Hẹn - Lần Hẹn(Đỏ)");
      const vungIdx = findColumnIndex(headers, "Vùng");
      const tinhThanhIdx = findColumnIndex(headers, "Tỉnh thành");

      // Thử tìm các cột quan trọng với tên có thể thay đổi một chút
      if (doiTacIdx === -1) {
        for (let i = 0; i < headers.length; i++) {
          if (
            headers[i] &&
            headers[i].toString().toLowerCase().includes("đối tác")
          ) {
            console.log("Found alternative 'Đối tác' column at index", i);
            doiTacIdx = i;
            break;
          }
        }
      }

      if (tinhTrangIdx === -1) {
        for (let i = 0; i < headers.length; i++) {
          if (
            headers[i] &&
            headers[i].toString().toLowerCase().includes("tình trạng")
          ) {
            console.log("Found alternative 'Tình trạng' column at index", i);
            tinhTrangIdx = i;
            break;
          }
        }
      }

      if (ngayHenXanhIdx === -1 && ngayHenDoIdx === -1) {
        for (let i = 0; i < headers.length; i++) {
          if (
            headers[i] &&
            headers[i].toString().toLowerCase().includes("ngày hẹn")
          ) {
            if (headers[i].toString().toLowerCase().includes("xanh")) {
              console.log(
                "Found alternative 'Ngày Hẹn Xanh' column at index",
                i
              );
              ngayHenXanhIdx = i;
            } else if (headers[i].toString().toLowerCase().includes("đỏ")) {
              console.log("Found alternative 'Ngày Hẹn Đỏ' column at index", i);
              ngayHenDoIdx = i;
            }
          }
        }
      }

      // Kiểm tra các cột bắt buộc
      if (tinhTrangIdx === -1) {
        throw new Error("File bảo trì không có cột Tình trạng");
      }

      if (ngayHenXanhIdx === -1 && ngayHenDoIdx === -1) {
        // Tìm bất kỳ cột ngày nào có thể sử dụng
        let dateColumnIdx = -1;
        for (let i = 0; i < headers.length; i++) {
          if (
            headers[i] &&
            headers[i].toString().toLowerCase().includes("ngày")
          ) {
            console.log(
              "Found fallback date column:",
              headers[i],
              "at index",
              i
            );
            dateColumnIdx = i;
            break;
          }
        }

        if (dateColumnIdx === -1) {
          throw new Error("File bảo trì không có cột ngày nào");
        }

        // Sử dụng cột ngày này làm thay thế
        ngayHenXanhIdx = dateColumnIdx;
      }

      // Chuẩn hóa dữ liệu
      const normalizedData = [];

      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i];
        if (!row || row.length === 0) continue;

        // Lấy ngày từ Ngày Hẹn - Lần Hẹn(Xanh) hoặc Ngày Hẹn - Lần Hẹn(Đỏ)
        let dateValue = "";
        if (
          ngayHenXanhIdx !== -1 &&
          row[ngayHenXanhIdx] &&
          row[ngayHenXanhIdx].toString().trim() !== ""
        ) {
          dateValue = formatDate(row[ngayHenXanhIdx]);
        } else if (
          ngayHenDoIdx !== -1 &&
          row[ngayHenDoIdx] &&
          row[ngayHenDoIdx].toString().trim() !== ""
        ) {
          dateValue = formatDate(row[ngayHenDoIdx]);
        }

        if (!dateValue) {
          // Nếu không có ngày, sử dụng ngày hiện tại
          dateValue = formatDate(new Date());
        }

        // Lấy thông tin tình trạng để xác định loại bảo trì
        let tinhTrang = "";
        if (tinhTrangIdx !== -1 && row[tinhTrangIdx]) {
          tinhTrang = row[tinhTrangIdx].toString().trim();
        }

        // Xác định loại bảo trì dựa trên API
        const maintenanceType = getMaintenanceType(tinhTrang);

        // Lấy thông tin nhân sự và tìm kiếm trong API
        const personnelName =
          nhanSuIdx !== -1 ? (row[nhanSuIdx] || "").toString() : "";
        const personnelInfo = findPersonnelInfo(personnelName);

        // Sử dụng thông tin từ API nếu có, nếu không thì dùng dữ liệu từ file
        let partnerFromAPI = "";
        let blockFromAPI = "";

        if (personnelInfo) {
          partnerFromAPI = personnelInfo.doiTac || "";
          blockFromAPI = personnelInfo.block || "";
        }

        // Ưu tiên thông tin từ API, sau đó từ file
        const finalPartner =
          partnerFromAPI ||
          (doiTacIdx !== -1 ? (row[doiTacIdx] || "").toString() : "");
        const finalBlock =
          blockFromAPI ||
          (blockIdx !== -1 ? (row[blockIdx] || "").toString() : "");

        // Lấy thông tin khu vực
        const region = vungIdx !== -1 ? (row[vungIdx] || "").toString() : "";
        const province =
          tinhThanhIdx !== -1 ? (row[tinhThanhIdx] || "").toString() : "";

        // Tạo item dữ liệu
        normalizedData.push({
          partner: finalPartner,
          block: finalBlock,
          blockNhanSu:
            blockNhanSuIdx !== -1 ? (row[blockNhanSuIdx] || "").toString() : "",
          personnel: personnelName,
          date: dateValue,
          region: region,
          province: province,
          maintenanceType: maintenanceType,
          tinhTrang: tinhTrang,
          rawData: row, // Lưu dữ liệu gốc để xuất file
        });
      }

      // Tổng hợp dữ liệu bảo trì
      const aggregatedMaintenanceData =
        aggregateMaintenanceData(normalizedData);

      // Cập nhật state
      setMaintenanceData(aggregatedMaintenanceData);

      // Cập nhật uploadedFiles state
      setUploadedFiles((prev) => ({
        ...prev,
        tonBaoTri: file,
      }));

      // Nếu đã có đủ dữ liệu thì tạo lại cấu trúc phân cấp
      if (data.length > 0) {
        createHierarchicalData([...data, ...aggregatedMaintenanceData]);
      }

      return true;
    } catch (error) {
      console.error("Lỗi xử lý file bảo trì:", error);
      setError(`Lỗi xử lý file bảo trì: ${error.message}`);
      return false;
    }
  };

  // Phân tích và xử lý file lịch trực
  const processDutyScheduleFile = async (file, existingWorkbook = null) => {
    try {
      let workbook = existingWorkbook;
      if (!workbook) {
        const arrayBuffer = await file.arrayBuffer();
        workbook = XLSX.read(arrayBuffer, {
          type: "array",
          cellDates: true,
          cellStyles: true,
          cellFormulas: true,
        });
      }

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (jsonData.length <= 1) {
        throw new Error("File lịch trực không có dữ liệu");
      }

      // Lấy header
      const headers = jsonData[0];
      console.log("Processing duty schedule file with headers:", headers);

      // Tìm vị trí các cột quan trọng
      const doiTacIdx = findColumnIndex(headers, "Đối tác");
      const blockIdx = findColumnIndex(headers, "Block");

      // Kiểm tra các cột bắt buộc
      if (doiTacIdx === -1) {
        // Tìm bất kỳ cột nào có thể là đối tác
        for (let i = 0; i < headers.length; i++) {
          if (
            headers[i] &&
            headers[i].toString().toLowerCase().includes("đối tác")
          ) {
            console.log("Found alternative 'Đối tác' column at index", i);
            doiTacIdx = i;
            break;
          }
        }

        if (doiTacIdx === -1) {
          throw new Error("File lịch trực không có cột Đối tác");
        }
      }

      if (blockIdx === -1) {
        // Tìm bất kỳ cột nào có thể là block
        for (let i = 0; i < headers.length; i++) {
          if (
            headers[i] &&
            headers[i].toString().toLowerCase().includes("block")
          ) {
            console.log("Found alternative 'Block' column at index", i);
            blockIdx = i;
            break;
          }
        }

        if (blockIdx === -1) {
          throw new Error("File lịch trực không có cột Block");
        }
      }

      // Tìm các cột cho CA1 (có thể có nhiều cột cho các ngày khác nhau)
      const ca1Columns = [];
      headers.forEach((header, index) => {
        if (header && typeof header === "string") {
          ca1Columns.push(index);
        }
      });

      if (ca1Columns.length === 0) {
        throw new Error("File lịch trực không có cột cho các ngày");
      }

      // Chuẩn hóa dữ liệu
      const dutyData = [];

      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i];
        if (!row || row.length === 0) continue;

        const partner =
          doiTacIdx !== -1 ? (row[doiTacIdx] || "").toString() : "";
        const block = blockIdx !== -1 ? (row[blockIdx] || "").toString() : "";

        if (!partner || !block) continue;

        // Đếm số lượng CA1 (ON) và O (OFF)
        let onCount = 0;
        let offCount = 0;

        ca1Columns.forEach((colIdx) => {
          if (row[colIdx]) {
            const value = row[colIdx].toString().trim().toUpperCase();
            if (value === "CA1") {
              onCount++;
            } else if (value === "O") {
              offCount++;
            }
          }
        });

        // Thêm vào danh sách
        dutyData.push({
          partner,
          block,
          onCount,
          offCount,
        });
      }

      // Tổng hợp dữ liệu lịch trực theo đối tác và block
      const aggregatedDutyData = dutyData.reduce((acc, item) => {
        const key = `${item.partner}_${item.block}`;

        if (!acc[key]) {
          acc[key] = {
            partner: item.partner,
            block: item.block,
            onCount: 0,
            offCount: 0,
          };
        }

        acc[key].onCount += item.onCount;
        acc[key].offCount += item.offCount;

        return acc;
      }, {});

      // Chuyển từ object sang array
      const dutyScheduleData = Object.values(aggregatedDutyData);

      // Cập nhật state
      setDutyScheduleData(dutyScheduleData);

      // Cập nhật uploadedFiles state
      setUploadedFiles((prev) => ({
        ...prev,
        lichTruc: file,
      }));

      return true;
    } catch (error) {
      console.error("Lỗi xử lý file lịch trực:", error);
      setError(`Lỗi xử lý file lịch trực: ${error.message}`);
      return false;
    }
  };

  // Hàm hỗ trợ tìm vị trí cột (linh hoạt hơn)
  const findColumnIndex = (headers, columnName) => {
    if (!headers || !columnName) return -1;

    // Tìm chính xác
    const exactIndex = headers.findIndex(
      (h) => h && h.toString() === columnName
    );

    if (exactIndex !== -1) return exactIndex;

    // Tìm gần đúng
    const partialIndex = headers.findIndex(
      (h) => h && h.toString().includes(columnName)
    );

    if (partialIndex !== -1) return partialIndex;

    // Tìm không phân biệt hoa thường
    return headers.findIndex(
      (h) => h && h.toString().toLowerCase().includes(columnName.toLowerCase())
    );
  };

  // Hàm định dạng ngày
  const formatDate = (dateValue) => {
    if (!dateValue) return "";

    let dateStr = "";

    if (typeof dateValue === "string") {
      // Xử lý chuỗi ngày với định dạng "DD-MM-YYYY HH:MM:SS"
      const parts = dateValue.split(/[\s\/\-:]/);

      // Kiểm tra xem có phải định dạng DD-MM-YYYY
      if (parts.length >= 3) {
        let day, month, year;

        // Thử xác định vị trí của ngày, tháng, năm
        if (parts[0].length === 4) {
          // Định dạng YYYY-MM-DD
          year = parts[0];
          month = parts[1];
          day = parts[2];
        } else {
          // Định dạng DD-MM-YYYY hoặc MM-DD-YYYY
          // Giả định DD-MM-YYYY cho người dùng Việt Nam
          day = parts[0];
          month = parts[1];
          year = parts[2];

          // Nếu năm chỉ có 2 chữ số, thêm 20 vào trước
          if (year && year.length === 2) {
            year = "20" + year;
          }
        }

        // Chuẩn hóa ngày tháng
        if (day && month && year) {
          day = day.padStart(2, "0");
          month = month.padStart(2, "0");
          dateStr = `${year}-${month}-${day}`;
        } else {
          dateStr = dateValue;
        }
      } else {
        dateStr = dateValue;
      }
    } else if (dateValue instanceof Date) {
      // Xử lý đối tượng Date
      const day = dateValue.getDate().toString().padStart(2, "0");
      const month = (dateValue.getMonth() + 1).toString().padStart(2, "0");
      const year = dateValue.getFullYear();
      dateStr = `${year}-${month}-${day}`;
    }

    return dateStr;
  };

  // Hàm định dạng ngày để hiển thị
  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return "";

    const dateParts = dateStr.split("-");
    if (dateParts.length === 3) {
      return `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
    }

    return dateStr;
  };

  // Tổng hợp dữ liệu triển khai
  const aggregateData = (normalizedData) => {
    const aggregatedMap = {};

    normalizedData.forEach((item) => {
      // Tạo khóa duy nhất cho mỗi nhóm
      const key = `${item.date}_${item.partner}_${item.block}_${item.personnel}`;

      if (!aggregatedMap[key]) {
        aggregatedMap[key] = {
          date: item.date,
          partner: item.partner,
          block: item.block,
          blockNhanSu: item.blockNhanSu,
          personnel: item.personnel,
          region: item.region,
          province: item.province,
          total: 0,
          newDeployment: 0,
          relocation: 0,
          swap: 0,
          maintenancePhysical: 0,
          maintenanceLogical: 0,
          rawData: [],
        };
      }

      // Tăng tổng số lượng và số lượng theo loại
      aggregatedMap[key].total += 1;

      if (item.deploymentType === "newDeployment") {
        aggregatedMap[key].newDeployment += 1;
      } else if (item.deploymentType === "relocation") {
        aggregatedMap[key].relocation += 1;
      } else if (item.deploymentType === "swap") {
        aggregatedMap[key].swap += 1;
      }

      // Lưu dữ liệu gốc
      aggregatedMap[key].rawData.push(item.rawData);
    });

    return Object.values(aggregatedMap);
  };

  // Tổng hợp dữ liệu bảo trì
  const aggregateMaintenanceData = (normalizedData) => {
    const aggregatedMap = {};

    normalizedData.forEach((item) => {
      // Tạo khóa duy nhất cho mỗi nhóm
      const key = `${item.date}_${item.partner}_${item.block}_${item.personnel}`;

      if (!aggregatedMap[key]) {
        aggregatedMap[key] = {
          date: item.date,
          partner: item.partner,
          block: item.block,
          blockNhanSu: item.blockNhanSu,
          personnel: item.personnel,
          region: item.region,
          province: item.province,
          total: 0,
          newDeployment: 0,
          relocation: 0,
          swap: 0,
          maintenancePhysical: 0,
          maintenanceLogical: 0,
          rawData: [],
        };
      }

      // Tăng tổng số lượng và số lượng theo loại bảo trì
      aggregatedMap[key].total += 1;

      if (item.maintenanceType === "maintenancePhysical") {
        aggregatedMap[key].maintenancePhysical += 1;
      } else if (item.maintenanceType === "maintenanceLogical") {
        aggregatedMap[key].maintenanceLogical += 1;
      }

      // Lưu dữ liệu gốc
      aggregatedMap[key].rawData.push(item.rawData);
    });

    return Object.values(aggregatedMap);
  };

  // Kết hợp dữ liệu triển khai và bảo trì
  const combineData = () => {
    if (data.length === 0) return data;

    // Tạo bản sao của dữ liệu triển khai
    const combinedData = [...data];

    // Duyệt qua dữ liệu bảo trì và kết hợp với dữ liệu triển khai
    if (maintenanceData.length > 0) {
      maintenanceData.forEach((maintenanceItem) => {
        // Tìm item tương ứng trong dữ liệu triển khai
        const existingItemIndex = combinedData.findIndex(
          (item) =>
            item.date === maintenanceItem.date &&
            item.partner === maintenanceItem.partner &&
            item.block === maintenanceItem.block &&
            item.personnel === maintenanceItem.personnel
        );

        if (existingItemIndex !== -1) {
          // Nếu tìm thấy, cập nhật thông tin bảo trì
          combinedData[existingItemIndex].maintenancePhysical +=
            maintenanceItem.maintenancePhysical;
          combinedData[existingItemIndex].maintenanceLogical +=
            maintenanceItem.maintenanceLogical;
          combinedData[existingItemIndex].total +=
            maintenanceItem.maintenancePhysical +
            maintenanceItem.maintenanceLogical;

          // Kết hợp dữ liệu gốc
          combinedData[existingItemIndex].rawData = [
            ...combinedData[existingItemIndex].rawData,
            ...maintenanceItem.rawData,
          ];
        } else {
          // Nếu không tìm thấy, thêm mới vào danh sách
          combinedData.push(maintenanceItem);
        }
      });
    }

    return combinedData;
  };

  // Áp dụng bộ lọc cho dữ liệu
  const applyFilters = () => {
    // Kết hợp dữ liệu triển khai và bảo trì
    const combinedData = combineData();

    let filtered = [...combinedData];

    if (selectedPartner) {
      filtered = filtered.filter((item) => item.partner === selectedPartner);
    }

    if (selectedRegion) {
      filtered = filtered.filter((item) => item.region === selectedRegion);
    }

    if (startDate && endDate) {
      filtered = filtered.filter((item) => {
        return item.date >= startDate && item.date <= endDate;
      });
    }

    // Sắp xếp dữ liệu nếu cần
    if (sortConfig.key) {
      filtered = sortData(filtered, sortConfig.key, sortConfig.direction);
    }

    setFilteredData(filtered);
    calculateSummary(filtered);

    // Tạo lại cấu trúc phân cấp nếu có áp dụng bộ lọc
    if (selectedPartner || selectedRegion || startDate || endDate) {
      createHierarchicalData(filtered);
    } else {
      createHierarchicalData(combinedData);
    }
  };

  // Tạo cấu trúc dữ liệu phân cấp
  const createHierarchicalData = (data) => {
    // Nhóm dữ liệu theo đối tác -> block -> nhân sự
    const hierarchy = {};

    data.forEach((item) => {
      if (!hierarchy[item.partner]) {
        hierarchy[item.partner] = {
          name: item.partner,
          children: {},
          total: 0,
          newDeployment: 0,
          relocation: 0,
          swap: 0,
          maintenancePhysical: 0,
          maintenanceLogical: 0,
          onCount: 0,
          offCount: 0,
        };
      }

      // Cập nhật tổng cho đối tác
      hierarchy[item.partner].total += item.total;
      hierarchy[item.partner].newDeployment += item.newDeployment;
      hierarchy[item.partner].relocation += item.relocation;
      hierarchy[item.partner].swap += item.swap;
      hierarchy[item.partner].maintenancePhysical +=
        item.maintenancePhysical || 0;
      hierarchy[item.partner].maintenanceLogical +=
        item.maintenanceLogical || 0;

      const blockKey = item.block || "Unknown Block";
      if (!hierarchy[item.partner].children[blockKey]) {
        hierarchy[item.partner].children[blockKey] = {
          name: blockKey,
          children: {},
          total: 0,
          newDeployment: 0,
          relocation: 0,
          swap: 0,
          maintenancePhysical: 0,
          maintenanceLogical: 0,
          onCount: 0,
          offCount: 0,
        };
      }

      // Cập nhật tổng cho block
      hierarchy[item.partner].children[blockKey].total += item.total;
      hierarchy[item.partner].children[blockKey].newDeployment +=
        item.newDeployment;
      hierarchy[item.partner].children[blockKey].relocation += item.relocation;
      hierarchy[item.partner].children[blockKey].swap += item.swap;
      hierarchy[item.partner].children[blockKey].maintenancePhysical +=
        item.maintenancePhysical || 0;
      hierarchy[item.partner].children[blockKey].maintenanceLogical +=
        item.maintenanceLogical || 0;

      const personnelKey = item.personnel || "Unknown Personnel";
      if (!hierarchy[item.partner].children[blockKey].children[personnelKey]) {
        hierarchy[item.partner].children[blockKey].children[personnelKey] = {
          name: personnelKey,
          total: 0,
          newDeployment: 0,
          relocation: 0,
          swap: 0,
          maintenancePhysical: 0,
          maintenanceLogical: 0,
          items: [],
        };
      }

      // Cập nhật tổng cho nhân sự
      hierarchy[item.partner].children[blockKey].children[personnelKey].total +=
        item.total;
      hierarchy[item.partner].children[blockKey].children[
        personnelKey
      ].newDeployment += item.newDeployment;
      hierarchy[item.partner].children[blockKey].children[
        personnelKey
      ].relocation += item.relocation;
      hierarchy[item.partner].children[blockKey].children[personnelKey].swap +=
        item.swap;
      hierarchy[item.partner].children[blockKey].children[
        personnelKey
      ].maintenancePhysical += item.maintenancePhysical || 0;
      hierarchy[item.partner].children[blockKey].children[
        personnelKey
      ].maintenanceLogical += item.maintenanceLogical || 0;

      // Thêm item vào danh sách chi tiết
      hierarchy[item.partner].children[blockKey].children[
        personnelKey
      ].items.push(item);
    });

    // Cập nhật thông tin lịch trực
    if (dutyScheduleData.length > 0) {
      dutyScheduleData.forEach((dutyItem) => {
        if (
          hierarchy[dutyItem.partner] &&
          hierarchy[dutyItem.partner].children[dutyItem.block]
        ) {
          hierarchy[dutyItem.partner].onCount += dutyItem.onCount;
          hierarchy[dutyItem.partner].offCount += dutyItem.offCount;
          hierarchy[dutyItem.partner].children[dutyItem.block].onCount +=
            dutyItem.onCount;
          hierarchy[dutyItem.partner].children[dutyItem.block].offCount +=
            dutyItem.offCount;
        }
      });
    }

    // Chuyển đổi cấu trúc đối tượng thành mảng để dễ dàng sử dụng
    const hierarchicalArray = Object.values(hierarchy).map((partner) => {
      partner.children = Object.values(partner.children).map((block) => {
        block.children = Object.values(block.children);
        return block;
      });
      return partner;
    });

    // Sắp xếp các đối tác theo số
    hierarchicalArray.sort((a, b) => {
      const numA = parseInt(a.name.match(/\d+/) || [0]);
      const numB = parseInt(b.name.match(/\d+/) || [0]);
      return numA - numB;
    });

    setHierarchicalData(hierarchicalArray);
  };

  // Tính toán dữ liệu tổng hợp
  const calculateSummary = (filteredData) => {
    const summary = filteredData.reduce(
      (acc, item) => ({
        totalInventory: acc.totalInventory + (item.total || 0),
        newDeployment: acc.newDeployment + (item.newDeployment || 0),
        relocation: acc.relocation + (item.relocation || 0),
        swap: acc.swap + (item.swap || 0),
        maintenancePhysical:
          acc.maintenancePhysical + (item.maintenancePhysical || 0),
        maintenanceLogical:
          acc.maintenanceLogical + (item.maintenanceLogical || 0),
      }),
      {
        totalInventory: 0,
        newDeployment: 0,
        relocation: 0,
        swap: 0,
        maintenancePhysical: 0,
        maintenanceLogical: 0,
      }
    );

    setSummaryData(summary);
  };

  // Xử lý xuất file Excel
  const handleExport = () => {
    try {
      if (filteredData.length === 0) {
        setError("Không có dữ liệu để xuất");
        return;
      }

      // Chuẩn bị dữ liệu để xuất
      const exportData = filteredData.map((item) => ({
        "Đối Tác": item.partner,
        Block: item.block,
        "Block Nhân Sự": item.blockNhanSu,
        "Nhân Sự": item.personnel,
        "Khu Vực": item.region,
        "Tỉnh Thành": item.province,
        Ngày: item.date,
        "Tổng Tồn": item.total,
        "Triển Khai Mới": item.newDeployment,
        "Chuyển Địa Điểm": item.relocation,
        Swap: item.swap,
        "Bảo Trì Vật Lý": item.maintenancePhysical || 0,
        "Bảo Trì Logic": item.maintenanceLogical || 0,
      }));

      // Tạo worksheet
      const worksheet = XLSX.utils.json_to_sheet(exportData);

      // Tạo workbook và thêm worksheet
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Ton Kho");

      // Tạo tên file
      const fileName = `Bao_Cao_Ton_${startDate || "Start"}_${
        endDate || "End"
      }_${selectedPartner || "TatCa"}_${new Date()
        .toISOString()
        .slice(0, 10)}.xlsx`;

      // Viết file và kích hoạt tải xuống
      XLSX.writeFile(workbook, fileName);
    } catch (error) {
      console.error("Lỗi xuất file Excel:", error);
      setError(`Lỗi xuất file Excel: ${error.message}`);
    }
  };

  // Nhóm dữ liệu theo trường được chỉ định cho biểu đồ
  const groupDataBy = (field, metrics = ["total"]) => {
    return Object.entries(
      filteredData.reduce((acc, item) => {
        const key = item[field];
        if (!acc[key]) {
          acc[key] = metrics.reduce(
            (obj, metric) => {
              obj[metric] = 0;
              return obj;
            },
            { [field]: key }
          );
        }

        metrics.forEach((metric) => {
          acc[key][metric] += item[metric] || 0;
        });

        return acc;
      }, {})
    ).map(([_, value]) => value);
  };

  // Nhóm dữ liệu theo ngày cho biểu đồ
  const groupDataByDate = () => {
    return Object.entries(
      filteredData.reduce((acc, item) => {
        const date = item.date;
        if (!acc[date]) {
          acc[date] = {
            date,
            total: 0,
            newDeployment: 0,
            relocation: 0,
            swap: 0,
            maintenancePhysical: 0,
            maintenanceLogical: 0,
          };
        }

        acc[date].total += item.total || 0;
        acc[date].newDeployment += item.newDeployment || 0;
        acc[date].relocation += item.relocation || 0;
        acc[date].swap += item.swap || 0;
        acc[date].maintenancePhysical += item.maintenancePhysical || 0;
        acc[date].maintenanceLogical += item.maintenanceLogical || 0;

        return acc;
      }, {})
    )
      .map(([_, value]) => value)
      .sort((a, b) => a.date.localeCompare(b.date));
  };

  // Hàm xử lý sắp xếp
  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Hiển thị mũi tên sắp xếp
  const getSortDirectionIcon = (key) => {
    if (sortConfig.key !== key) {
      return <span className="text-gray-400">↕</span>;
    }
    return sortConfig.direction === "ascending" ? (
      <span>↑</span>
    ) : (
      <span>↓</span>
    );
  };

  // Xử lý mở rộng/thu gọn đối tác
  const togglePartner = (partnerName) => {
    setExpandedItems((prevState) => ({
      ...prevState,
      partners: {
        ...prevState.partners,
        [partnerName]: !prevState.partners[partnerName],
      },
    }));
  };

  // Xử lý mở rộng/thu gọn block
  const toggleBlock = (partnerName, blockName) => {
    const blockKey = `${partnerName}-${blockName}`;
    setExpandedItems((prevState) => ({
      ...prevState,
      blocks: {
        ...prevState.blocks,
        [blockKey]: !prevState.blocks[blockKey],
      },
    }));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Báo Cáo Chi Tiết Tồn</h1>

      {/* Thông báo lỗi */}
      {error && (
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6"
          role="alert"
        >
          <p>{error}</p>
          <button
            className="mt-2 text-sm text-red-800 underline"
            onClick={() => setError(null)}
          >
            Đóng
          </button>
        </div>
      )}

      {/* Phần import file */}
      <div className="mb-6 bg-gray-100 p-4 rounded-lg">
        <h2 className="text-lg font-medium mb-2">Import Dữ Liệu</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <h3 className="text-sm font-medium mb-1">File Tồn Triển Khai</h3>
            <div className="flex items-center">
              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileImport}
                className="hidden"
                id="fileTrienKhai"
                disabled={loading}
              />
              <label
                htmlFor="fileTrienKhai"
                className={`inline-block px-4 py-2 rounded cursor-pointer ${
                  loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
                } text-white`}
              >
                Chọn File
              </label>
              {uploadedFiles.tonTrienKhai && (
                <span className="ml-2 text-green-600">✓ Đã tải lên</span>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-1">File Tồn Bảo Trì</h3>
            <div className="flex items-center">
              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileImport}
                className="hidden"
                id="fileBaoTri"
                disabled={loading}
              />
              <label
                htmlFor="fileBaoTri"
                className={`inline-block px-4 py-2 rounded cursor-pointer ${
                  loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
                } text-white`}
              >
                Chọn File
              </label>
              {uploadedFiles.tonBaoTri && (
                <span className="ml-2 text-green-600">✓ Đã tải lên</span>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-1">File Lịch Trực</h3>
            <div className="flex items-center">
              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileImport}
                className="hidden"
                id="fileLichTruc"
                disabled={loading}
              />
              <label
                htmlFor="fileLichTruc"
                className={`inline-block px-4 py-2 rounded cursor-pointer ${
                  loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
                } text-white`}
              >
                Chọn File
              </label>
              {uploadedFiles.lichTruc && (
                <span className="ml-2 text-green-600">✓ Đã tải lên</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            <p>✓ Dữ liệu nhân sự: {personnelMappingData.length} records</p>
            <p>✓ Dữ liệu tình trạng: {statusMappingData.length} records</p>
          </div>
          <button
            onClick={handleExport}
            disabled={loading || filteredData.length === 0}
            className={`px-4 py-2 rounded ${
              loading || filteredData.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600 cursor-pointer"
            } text-white`}
          >
            Export Excel
          </button>
        </div>

        {!excelLoaded && !loading && (
          <div className="mt-4 text-blue-700">
            <p>
              Vui lòng import các file Excel để bắt đầu. Cần có đủ file Tồn
              Triển Khai, Tồn Bảo Trì và Lịch Trực.
            </p>
          </div>
        )}

        {loading && (
          <div className="mt-4 flex items-center text-blue-700">
            <svg
              className="animate-spin h-5 w-5 mr-3"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p>Đang xử lý dữ liệu...</p>
          </div>
        )}
      </div>

      {allFilesUploaded && excelLoaded && (
        <>
          {/* Bộ lọc */}
          <div className="mb-6">
            <div className="bg-[#4682b4] text-white p-4 font-bold text-xl rounded-t-lg">
              BỘ LỌC
            </div>
            <div className="bg-gray-100 p-4 rounded-b-lg border border-gray-300">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="col-span-1">
                  <label className="block text-sm font-medium mb-1">
                    Từ ngày
                  </label>
                  <input
                    type="date"
                    className="w-full p-2 border rounded"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>

                <div className="col-span-1">
                  <label className="block text-sm font-medium mb-1">
                    Đến ngày
                  </label>
                  <input
                    type="date"
                    className="w-full p-2 border rounded"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>

                <div className="col-span-1">
                  <label className="block text-sm font-medium mb-1">
                    Khu vực
                  </label>
                  <select
                    className="w-full p-2 border rounded"
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                  >
                    <option value="">Tất cả</option>
                    {regions.map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-1">
                  <label className="block text-sm font-medium mb-1">
                    Đối Tác
                  </label>
                  <select
                    className="w-full p-2 border rounded"
                    value={selectedPartner}
                    onChange={(e) => setSelectedPartner(e.target.value)}
                  >
                    <option value="">Tất cả</option>
                    {partners.map((partner) => (
                      <option key={partner} value={partner}>
                        {partner}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Thẻ tổng hợp */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
            <div className="bg-blue-100 p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold">Tổng Tồn</h2>
              <p className="text-3xl font-bold">
                {summaryData.totalInventory.toLocaleString()}
              </p>
            </div>

            <div className="bg-green-100 p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold">Triển Khai Mới</h2>
              <p className="text-3xl font-bold">
                {summaryData.newDeployment.toLocaleString()}
              </p>
            </div>

            <div className="bg-yellow-100 p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold">Chuyển Địa Điểm</h2>
              <p className="text-3xl font-bold">
                {summaryData.relocation.toLocaleString()}
              </p>
            </div>

            <div className="bg-purple-100 p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold">Swap</h2>
              <p className="text-3xl font-bold">
                {summaryData.swap.toLocaleString()}
              </p>
            </div>

            <div className="bg-red-100 p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold">Bảo Trì Vật Lý</h2>
              <p className="text-3xl font-bold">
                {summaryData.maintenancePhysical.toLocaleString()}
              </p>
            </div>

            <div className="bg-orange-100 p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold">Bảo Trì Logic</h2>
              <p className="text-3xl font-bold">
                {summaryData.maintenanceLogical.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Phần biểu đồ */}
          {filteredData.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Biểu Đồ Phân Tích</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Phân bố theo đối tác */}
                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="text-lg font-medium mb-2">
                    Phân Bố Theo Đối Tác
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={[
                        ...groupDataBy("partner", [
                          "total",
                          "newDeployment",
                          "relocation",
                          "swap",
                          "maintenancePhysical",
                          "maintenanceLogical",
                        ]),
                      ].sort((a, b) => a.partner.localeCompare(b.partner))}
                      margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="partner"
                        angle={-45}
                        textAnchor="end"
                        height={70}
                      />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="total" fill="#8884d8" name="Tổng Tồn" />
                      <Bar
                        dataKey="newDeployment"
                        fill="#82ca9d"
                        name="Triển Khai Mới"
                      />
                      <Bar
                        dataKey="relocation"
                        fill="#ffc658"
                        name="Chuyển Địa Điểm"
                      />
                      <Bar dataKey="swap" fill="#ff8042" name="Swap" />
                      <Bar
                        dataKey="maintenancePhysical"
                        fill="#d81b60"
                        name="Bảo Trì Vật Lý"
                      />
                      <Bar
                        dataKey="maintenanceLogical"
                        fill="#ffb74d"
                        name="Bảo Trì Logic"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Biểu đồ theo ngày */}
                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="text-lg font-medium mb-2">
                    Phân Bố Theo Ngày
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                      data={groupDataByDate()}
                      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        angle={-45}
                        textAnchor="end"
                        height={70}
                      />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="total"
                        stroke="#8884d8"
                        name="Tổng Tồn"
                        activeDot={{ r: 8 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="newDeployment"
                        stroke="#82ca9d"
                        name="Triển Khai Mới"
                      />
                      <Line
                        type="monotone"
                        dataKey="relocation"
                        stroke="#ffc658"
                        name="Chuyển Địa Điểm"
                      />
                      <Line
                        type="monotone"
                        dataKey="swap"
                        stroke="#ff8042"
                        name="Swap"
                      />
                      <Line
                        type="monotone"
                        dataKey="maintenancePhysical"
                        stroke="#d81b60"
                        name="Bảo Trì Vật Lý"
                      />
                      <Line
                        type="monotone"
                        dataKey="maintenanceLogical"
                        stroke="#ffb74d"
                        name="Bảo Trì Logic"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* Bảng chi tiết phân cấp */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">
              Dữ liệu từ ngày {formatDisplayDate(startDate)} đến ngày{" "}
              {formatDisplayDate(endDate)}
            </h2>
            <div className="overflow-x-auto border border-gray-300 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Đối Tác
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tổng Tồn
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Triển Khai Mới
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Chuyển Địa Điểm
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Swap
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bảo Trì Vật Lý
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bảo Trì Logic
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ON (CA1)
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      OFF (O)
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {hierarchicalData.map((partner, partnerIndex) => (
                    <React.Fragment key={`partner-${partnerIndex}`}>
                      {/* Dòng Đối tác */}
                      <tr className="bg-blue-50 hover:bg-blue-100">
                        <td className="px-6 py-2">
                          <button
                            className="flex items-center font-semibold focus:outline-none"
                            onClick={() => togglePartner(partner.name)}
                          >
                            <span className="inline-block w-4 mr-2 text-center">
                              {expandedItems.partners[partner.name] ? "−" : "+"}
                            </span>
                            {partner.name}
                          </button>
                        </td>
                        <td className="px-6 py-2 text-center font-semibold">
                          {partner.total}
                        </td>
                        <td className="px-6 py-2 text-center">
                          {partner.newDeployment}
                        </td>
                        <td className="px-6 py-2 text-center">
                          {partner.relocation}
                        </td>
                        <td className="px-6 py-2 text-center">
                          {partner.swap}
                        </td>
                        <td className="px-6 py-2 text-center">
                          {partner.maintenancePhysical}
                        </td>
                        <td className="px-6 py-2 text-center">
                          {partner.maintenanceLogical}
                        </td>
                        <td className="px-6 py-2 text-center">
                          {partner.onCount}
                        </td>
                        <td className="px-6 py-2 text-center">
                          {partner.offCount}
                        </td>
                      </tr>

                      {/* Hiển thị các Block nếu đối tác được mở rộng */}
                      {expandedItems.partners[partner.name] &&
                        [...partner.children]
                          .sort((a, b) => a.name.localeCompare(b.name))
                          .map((block, blockIndex) => (
                            <React.Fragment
                              key={`block-${partnerIndex}-${blockIndex}`}
                            >
                              {/* Dòng Block */}
                              <tr className="bg-gray-50 hover:bg-gray-100">
                                <td className="px-6 py-2 pl-10">
                                  <button
                                    className="flex items-center font-medium focus:outline-none"
                                    onClick={() =>
                                      toggleBlock(partner.name, block.name)
                                    }
                                  >
                                    <span className="inline-block w-4 mr-2 text-center">
                                      {expandedItems.blocks[
                                        `${partner.name}-${block.name}`
                                      ]
                                        ? "−"
                                        : "+"}
                                    </span>
                                    {block.name}
                                  </button>
                                </td>
                                <td className="px-6 py-2 text-center font-medium">
                                  {block.total}
                                </td>
                                <td className="px-6 py-2 text-center">
                                  {block.newDeployment}
                                </td>
                                <td className="px-6 py-2 text-center">
                                  {block.relocation}
                                </td>
                                <td className="px-6 py-2 text-center">
                                  {block.swap}
                                </td>
                                <td className="px-6 py-2 text-center">
                                  {block.maintenancePhysical}
                                </td>
                                <td className="px-6 py-2 text-center">
                                  {block.maintenanceLogical}
                                </td>
                                <td className="px-6 py-2 text-center">
                                  {block.onCount}
                                </td>
                                <td className="px-6 py-2 text-center">
                                  {block.offCount}
                                </td>
                              </tr>

                              {/* Hiển thị các Nhân sự nếu block được mở rộng */}
                              {expandedItems.blocks[
                                `${partner.name}-${block.name}`
                              ] &&
                                block.children.map(
                                  (personnel, personnelIndex) => (
                                    <tr
                                      key={`personnel-${partnerIndex}-${blockIndex}-${personnelIndex}`}
                                      className="hover:bg-gray-50"
                                    >
                                      <td className="px-6 py-2 pl-16">
                                        {personnel.name}
                                      </td>
                                      <td className="px-6 py-2 text-center">
                                        {personnel.total}
                                      </td>
                                      <td className="px-6 py-2 text-center">
                                        {personnel.newDeployment}
                                      </td>
                                      <td className="px-6 py-2 text-center">
                                        {personnel.relocation}
                                      </td>
                                      <td className="px-6 py-2 text-center">
                                        {personnel.swap}
                                      </td>
                                      <td className="px-6 py-2 text-center">
                                        {personnel.maintenancePhysical}
                                      </td>
                                      <td className="px-6 py-2 text-center">
                                        {personnel.maintenanceLogical}
                                      </td>
                                      <td className="px-6 py-2 text-center">
                                        -
                                      </td>
                                      <td className="px-6 py-2 text-center">
                                        -
                                      </td>
                                    </tr>
                                  )
                                )}
                            </React.Fragment>
                          ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bảng tổng tồn */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Bảng Tổng Tồn</h2>
            <div className="bg-white rounded-lg shadow overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort("partner")}
                    >
                      Đối Tác {getSortDirectionIcon("partner")}
                    </th>
                    <th
                      className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort("block")}
                    >
                      Block {getSortDirectionIcon("block")}
                    </th>
                    <th
                      className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort("blockNhanSu")}
                    >
                      Block Nhân Sự {getSortDirectionIcon("blockNhanSu")}
                    </th>
                    <th
                      className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort("personnel")}
                    >
                      Nhân Sự {getSortDirectionIcon("personnel")}
                    </th>
                    <th
                      className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort("date")}
                    >
                      Ngày {getSortDirectionIcon("date")}
                    </th>
                    <th
                      className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort("total")}
                    >
                      Tổng Tồn {getSortDirectionIcon("total")}
                    </th>
                    <th
                      className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort("newDeployment")}
                    >
                      Triển Khai Mới {getSortDirectionIcon("newDeployment")}
                    </th>
                    <th
                      className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort("relocation")}
                    >
                      Chuyển Địa Điểm {getSortDirectionIcon("relocation")}
                    </th>
                    <th
                      className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort("swap")}
                    >
                      Swap {getSortDirectionIcon("swap")}
                    </th>
                    <th
                      className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort("maintenancePhysical")}
                    >
                      Bảo Trì Vật Lý{" "}
                      {getSortDirectionIcon("maintenancePhysical")}
                    </th>
                    <th
                      className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort("maintenanceLogical")}
                    >
                      Bảo Trì Logic {getSortDirectionIcon("maintenanceLogical")}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.length === 0 ? (
                    <tr>
                      <td
                        colSpan="11"
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        Không có dữ liệu phù hợp với các bộ lọc đã chọn
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((item, index) => (
                      <tr
                        key={index}
                        className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                      >
                        <td className="px-6 py-4 text-center whitespace-nowrap">
                          {item.partner}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {item.block}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {item.blockNhanSu}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {item.personnel}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {formatDisplayDate(item.date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center font-semibold">
                          {item.total.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {item.newDeployment.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {item.relocation.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {item.swap.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {(item.maintenancePhysical || 0).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {(item.maintenanceLogical || 0).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;