import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";

export default function AdminDashboard() {
  return (
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

    const fileName = `Danh_Sach_Nhan_Su_${new Date().toISOString().slice(0, 10)}.xlsx`;
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

    const fileName = `Danh_Sach_Tinh_Trang_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  // Delete personnel
  const deletePersonnel = async (id) => {
    if (!confirm("Bạn có chắc chắn muốn xóa nhân sự này?")) return;

    try {
      setLoading(true);
      
      // Filter out the item to delete
      const updatedData = personnelData.filter(item => item.id !== id);
      
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
      const updatedData = statusData.filter(item => item.id !== id);
      
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
                <label className="block text-sm font-medium mb-1">Nhân Sự</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={newPersonnel.nhanSu}
                  onChange={(e) => setNewPersonnel({ ...newPersonnel, nhanSu: e.target.value })}
                  placeholder="Tên nhân sự"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Block</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={newPersonnel.block}
                  onChange={(e) => setNewPersonnel({ ...newPersonnel, block: e.target.value })}
                  placeholder="Tên block"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Đối Tác</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={newPersonnel.doiTac}
                  onChange={(e) => setNewPersonnel({ ...newPersonnel, doiTac: e.target.value })}
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
            <h2 className="text-lg font-semibold mb-4">Import/Export Nhân Sự</h2>
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
                <label className="block text-sm font-medium mb-1">Tình Trạng</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={newStatus.tinhTrang}
                  onChange={(e) => setNewStatus({ ...newStatus, tinhTrang: e.target.value })}
                  placeholder="Tình trạng lỗi"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Loại Cls</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={newStatus.loaiCls}
                  onChange={(e) => setNewStatus({ ...newStatus, loaiCls: e.target.value })}
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
            <h2 className="text-lg font-semibold mb-4">Import/Export Tình Trạng</h2>
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
  )
}
