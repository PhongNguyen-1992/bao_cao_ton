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

  // Lọc dữ liệu khi bộ lọc thay đổi
  useEffect(() => {
    if (data.length > 0) {
      applyFilters();
    }
  }, [data, selectedPartner, selectedRegion, startDate, endDate, sortConfig]);

  // Phân tích và xử lý dữ liệu từ file Excel
  const processExcelFile = async (file) => {
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, {
        type: "array",
        cellDates: true,
        cellStyles: true,
        cellFormulas: true,
      });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (jsonData.length <= 1) {
        throw new Error("File Excel không có dữ liệu");
      }

      // Lấy header
      const headers = jsonData[0];

      // Tìm vị trí các cột quan trọng
      const doiTacIdx = headers.findIndex(
        (h) => h && h.toString().includes("Đối tác")
      );
      const blockIdx = headers.findIndex(
        (h) => h && h.toString().includes("Block")
      );
      const blockNhanSuIdx = headers.findIndex(
        (h) => h && h.toString().includes("Block nhân sự")
      );
      const nhanSuIdx = headers.findIndex(
        (h) => h && h.toString().includes("Nhân sự")
      );
      const tgHenXanhIdx = headers.findIndex(
        (h) => h && h.toString().includes("TG Hẹn xanh")
      );
      const tgHenDoIdx = headers.findIndex(
        (h) => h && h.toString().includes("TG Hẹn đỏ")
      );
      const loaiTrienKhaiIdx = headers.findIndex(
        (h) => h && h.toString().includes("Loại triển khai")
      );
      const vungIdx = headers.findIndex(
        (h) => h && h.toString().includes("Vùng")
      );
      const tinhThanhIdx = headers.findIndex(
        (h) => h && h.toString().includes("Tỉnh thành")
      );

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

        // Lấy thông tin khu vực
        const region = vungIdx !== -1 ? (row[vungIdx] || "").toString() : "";
        const province =
          tinhThanhIdx !== -1 ? (row[tinhThanhIdx] || "").toString() : "";

        // Tạo item dữ liệu
        normalizedData.push({
          partner: doiTacIdx !== -1 ? (row[doiTacIdx] || "").toString() : "",
          block: blockIdx !== -1 ? (row[blockIdx] || "").toString() : "",
          blockNhanSu:
            blockNhanSuIdx !== -1 ? (row[blockNhanSuIdx] || "").toString() : "",
          personnel: nhanSuIdx !== -1 ? (row[nhanSuIdx] || "").toString() : "",
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
      setLoading(false);
    } catch (error) {
      console.error("Lỗi xử lý file Excel:", error);
      setError(`Lỗi xử lý file Excel: ${error.message}`);
      setLoading(false);
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
        };
      }

      // Cập nhật tổng cho đối tác
      hierarchy[item.partner].total += item.total;
      hierarchy[item.partner].newDeployment += item.newDeployment;
      hierarchy[item.partner].relocation += item.relocation;
      hierarchy[item.partner].swap += item.swap;

      const blockKey = item.block || "Unknown Block";
      if (!hierarchy[item.partner].children[blockKey]) {
        hierarchy[item.partner].children[blockKey] = {
          name: blockKey,
          children: {},
          total: 0,
          newDeployment: 0,
          relocation: 0,
          swap: 0,
        };
      }

      // Cập nhật tổng cho block
      hierarchy[item.partner].children[blockKey].total += item.total;
      hierarchy[item.partner].children[blockKey].newDeployment +=
        item.newDeployment;
      hierarchy[item.partner].children[blockKey].relocation += item.relocation;
      hierarchy[item.partner].children[blockKey].swap += item.swap;

      const personnelKey = item.personnel || "Unknown Personnel";
      if (!hierarchy[item.partner].children[blockKey].children[personnelKey]) {
        hierarchy[item.partner].children[blockKey].children[personnelKey] = {
          name: personnelKey,
          total: 0,
          newDeployment: 0,
          relocation: 0,
          swap: 0,
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

      // Thêm item vào danh sách chi tiết
      hierarchy[item.partner].children[blockKey].children[
        personnelKey
      ].items.push(item);
    });

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

  // Hàm định dạng ngày
  const formatDate = (dateValue) => {
    if (!dateValue) return "";

    let dateStr = "";

    if (typeof dateValue === "string") {
      // Xử lý chuỗi ngày với định dạng "DD-MM-YYYY HH:MM:SS"
      const dateParts = dateValue.split(" ")[0].split("-");
      if (dateParts.length === 3) {
        const day = dateParts[0].padStart(2, "0");
        const month = dateParts[1].padStart(2, "0");
        const year = dateParts[2];
        dateStr = `${year}-${month}-${day}`;
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

  // Tổng hợp dữ liệu
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

  // Áp dụng bộ lọc cho dữ liệu
  const applyFilters = () => {
    let filtered = [...data];

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
      createHierarchicalData(data);
    }
  };

  // Tính toán dữ liệu tổng hợp
  const calculateSummary = (filteredData) => {
    const summary = filteredData.reduce(
      (acc, item) => ({
        totalInventory: acc.totalInventory + (item.total || 0),
        newDeployment: acc.newDeployment + (item.newDeployment || 0),
        relocation: acc.relocation + (item.relocation || 0),
        swap: acc.swap + (item.swap || 0),
      }),
      {
        totalInventory: 0,
        newDeployment: 0,
        relocation: 0,
        swap: 0,
      }
    );

    setSummaryData(summary);
  };

  // Xử lý import file Excel
  const handleFileImport = async (e) => {
    const file = e.target.files[0];
    if (file) {
      await processExcelFile(file);
    }
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
          };
        }

        acc[date].total += item.total || 0;
        acc[date].newDeployment += item.newDeployment || 0;
        acc[date].relocation += item.relocation || 0;
        acc[date].swap += item.swap || 0;

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
        </div>
      )}

      {/* Phần import file */}
      <div className="mb-6 bg-gray-100 p-4 rounded-lg">
        <h2 className="text-lg font-medium mb-2">Import Dữ Liệu</h2>
        <div className="flex items-center space-x-4">
          <div>
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileImport}
              className="hidden"
              id="fileInput"
              disabled={loading}
            />
            <label
              htmlFor="fileInput"
              className={`inline-block px-4 py-2 rounded cursor-pointer ${
                loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
              } text-white`}
            >
              Chọn File Excel
            </label>
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
            <p>Vui lòng import file Excel để bắt đầu.</p>
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

      {excelLoaded && (
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
                        ]),
                      ].sort((a, b) => a.partner.localeCompare(b.partner))} // 👈 Sort theo tên đối tác
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
                    <th className="w-1/5 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Đối Tác
                    </th>
                    <th className="w-2/5 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tổng Tồn
                    </th>
                    <th className="w-1/5 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Triển Khai Mới
                    </th>
                    <th className="w-1/5 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Chuyển Địa Điểm
                    </th>
                    <th className="w-1/5 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Swap
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
                      </tr>

                      {/* Hiển thị các Block nếu đối tác được mở rộng */}
                      {expandedItems.partners[partner.name] &&
                        [...partner.children]
                          .sort((a, b) => a.name.localeCompare(b.name)) // 🔹 Sắp xếp tăng dần theo tên Block
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
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.length === 0 ? (
                    <tr>
                      <td
                        colSpan="9"
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
                        <td className="px-6 py-4  text-center whitespace-nowrap">
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

export default InventoryDashboard;
