import React, { useState, useEffect, useRef } from "react";
import "./BookingTime.css";
import BookingModal from "../Modal/BookingModal";
import { table } from "console";

interface TimeRange {
  start: string;
  end: string;
}

interface Address {
  id: number;
  img: string;
  locationVi: string;
  towerAddress: string;
  price: string;
  seats: string;
}

interface SavedData {
  title: string;
  TimeRange: TimeRange;
  tableIndex: number;
  selectedCells: number[];
  mergedCell: {
    startCell: number;
    endCell: number;
  };
}

const getDefaultTimes = () => ({
  startTime: 7, // Thời gian bắt đầu (07:00)
  endTime: 14, // Thời gian kết thúc (14:00)
  cellsPerHour: 4, // Mỗi giờ chia thành 4 phần (mỗi phần 15 phút)
});

const BookingTime: React.FC = () => {
  const [selectedCells, setSelectedCells] = useState<number[][]>([]); // Mảng 2 chiều cho từng bảng
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isSelecting, setIsSelecting] = useState<boolean>(true);
  const [startIndex, setStartIndex] = useState<number | null>(null);
  const [draggingCell, setDraggingCell] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>({
    start: "",
    end: "",
  });
  const [activeTable, setActiveTable] = useState<number | null>(null); // Theo dõi bảng nào đang được chọn
  const [durationString, setDurationString] = useState<string>("");
  const [inputTitle, setInputTitle] = useState<string>("");
  const [savedData, setSavedData] = useState<SavedData[]>([]);

  const { startTime, endTime, cellsPerHour } = getDefaultTimes();
  const modalRef = useRef<HTMLDivElement | null>(null);
  const tableContainerRef = useRef<HTMLDivElement | null>(null);
  const [bookedRegions, setBookedRegions] = useState<
  { tableIndex: number; start: number; end: number }[]
>([]);


  const addressData: Address[] = [
    {
      id: 1,
      img: "../../images/meeting.jpg",
      locationVi: "Hà Nội",
      towerAddress: "Hanoi",
      price: "50000",
      seats: "10",
    },
    {
      id: 2,
      img: "../../images/meeting.jpg",
      locationVi: "Hồ Chí Minh",
      towerAddress: "Hochiminh",
      price: "60000",
      seats: "11",
    },
    {
      id: 3,
      img: "../../images/meeting.jpg",
      locationVi: "Đà Nẵng",
      towerAddress: "Danang",
      price: "70000",
      seats: "12",
    },
    {
      id: 4,
      img: "../../images/meeting.jpg",
      locationVi: "Booth Tokyo",
      towerAddress: "Booth Tokyo",
      price: "80000",
      seats: "13",
    },
  ];

  useEffect(() => {
    setSelectedCells(new Array(addressData.length).fill([]));

    const handleClickOutside = (event: MouseEvent) => {
      if (
        isModalOpen &&
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        closeModal();
      }
      if (
        !isModalOpen &&
        tableContainerRef.current &&
        !tableContainerRef.current.contains(event.target as Node)
      ) {
        setSelectedCells((prevSelected) => {
          return prevSelected.map((tableCells, tableIndex) => {
            const savedCells = savedData
              .filter((data) => data.tableIndex === tableIndex)
              .flatMap((data) => data.selectedCells);
            return tableCells.filter((cell) => savedCells.includes(cell));
          });
        });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [addressData.length, isModalOpen, savedData]);

  const getTimeFromCellIndex = (index: number): string => {
    const hour = Math.floor(index / cellsPerHour) + startTime;
    const minute = (index % cellsPerHour) * (60 / cellsPerHour);
    return `${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}`;
  };

  const getDuration = (selectedCells: number[]): string => {
    if (selectedCells.length === 0) return "0h00";

    const startCellIndex = selectedCells[0];
    const endCellIndex = selectedCells[selectedCells.length - 1];

    const startMinutes =
      Math.floor(startCellIndex / cellsPerHour) * 60 +
      (startCellIndex % cellsPerHour) * (60 / cellsPerHour);
    const endMinutes =
      Math.floor(endCellIndex / cellsPerHour) * 60 +
      (endCellIndex % cellsPerHour) * (60 / cellsPerHour);
    const durationMinutes = endMinutes - startMinutes + 60 / cellsPerHour;

    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;

    return `${hours}h${minutes.toString().padStart(2, "0")}`;
  };

  const getTimeRangeFromCells = (cells: number[]): TimeRange => {
    if (cells.length === 0) return { start: "", end: "" };
    const sortedCells = [...cells].sort((a, b) => a - b);
    return {
      start: getTimeFromCellIndex(sortedCells[0]),
      end: getTimeFromCellIndex(sortedCells[sortedCells.length - 1] + 1),
    };
  };

  const handleCellClick = (tableIndex: number, index: number) => {
    setSelectedCells((prevSelected) => {
      const newSelection = [...prevSelected];
      if (newSelection[tableIndex].includes(index)) {
        newSelection[tableIndex] = newSelection[tableIndex].filter(
          (i) => i !== index
        );
      } else {
        newSelection[tableIndex] = [...newSelection[tableIndex], index].sort(
          (a, b) => a - b
        );
      }
      setDurationString(getDuration(newSelection[tableIndex]));
      return newSelection;
    });
  };

  const handleMouseDown = (tableIndex: number, index: number) => {
    setIsDragging(true);
    setStartIndex(index);
    setDraggingCell(index);
    setActiveTable(tableIndex);

    if (selectedCells[tableIndex].includes(index)) {
      setIsSelecting(false);
    } else {
      setIsSelecting(true);
    }
    handleCellClick(tableIndex, index);
  };

  const handleMouseOver = (tableIndex: number, index: number) => {
    if (isDragging && draggingCell !== index && activeTable === tableIndex) {
      setDraggingCell(index);
      const range = getRange(startIndex as number, index);

      if (isSelecting) {
        setSelectedCells((prevSelected) => {
          const newSelection = [...prevSelected];
          newSelection[tableIndex] = Array.from(
            new Set([...newSelection[tableIndex], ...range])
          ).sort((a, b) => a - b);
          return newSelection;
        });
      } else {
        setSelectedCells((prevSelected) => {
          const newSelection = [...prevSelected];
          newSelection[tableIndex] = newSelection[tableIndex].filter(
            (i) => !range.includes(i)
          );
          return newSelection;
        });
      }
    }
  };

  const handleMouseUp = (tableIndex: number, index: number) => {
    setIsDragging(false);
    setStartIndex(null);
    setDraggingCell(null);
    setActiveTable(null);
    
    if (selectedCells[tableIndex].includes(index)) {
      const { start, end } = getTimeRangeFromCells(selectedCells[tableIndex]);
      setSelectedTimeRange({ start, end });
      setIsModalOpen(true);
      setActiveTable(tableIndex);
    }
  };

  const getRange = (start: number, end: number): number[] => {
    const min = Math.min(start, end);
    const max = Math.max(start, end);
    const range = [];
    for (let i = min; i <= max; i++) {
      range.push(i);
    }
    return range;
  };

  const getCellClassName = (tableIndex: number, index: number): string => {
    const isPartOfMergedCell = savedData.some(
      (data) =>
        data.tableIndex === tableIndex &&
        index >= data.mergedCell.startCell &&
        index <= data.mergedCell.endCell
    );
  
    if (isPartOfMergedCell) {
      return "cell merged";
    }
  
    if (isDragging && draggingCell === index && activeTable === tableIndex) {
      return "cell dragging";
    }
  
    if (!selectedCells[tableIndex].includes(index)) return "cell";
  
    const isFirst = !selectedCells[tableIndex].includes(index - 1);
    const isLast = !selectedCells[tableIndex].includes(index + 1);
    if (isFirst && isLast) return "cell selected single";
    if (isFirst) return "cell selected first";
    if (isLast) return "cell selected last";
    return "cell selected";
  };
  

  const handleTitle = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setInputTitle(event.target.value);
  };

  const renderMergedCells = (tableIndex: number): JSX.Element[] => {
    return savedData
      .filter((data) => data.tableIndex === tableIndex)
      .map(({ mergedCell, title, TimeRange }, index) => {
        const { startCell, endCell } = mergedCell;
        const cellStyle: React.CSSProperties = {
          gridColumnStart: startCell + 1, // Bắt đầu từ ô gộp đầu tiên
          gridColumnEnd: endCell + 2, // Kết thúc tại ô gộp cuối cùng + 1
          backgroundColor: "rgba(76, 175, 80, 0.6)",
          color: "#fff",
          textAlign: "center",
          borderRadius: "5px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        };
  
        return (
          <div key={index} className="merged-cell" style={cellStyle}>
            <strong>{title}</strong>
            <p>
              {TimeRange.start} - {TimeRange.end}
            </p>
          </div>
        );
      });
  };
  
  

  const handleSave = (shouldMerge: boolean): void => {
    if (shouldMerge) {
      const newSavedData: SavedData = {
        title: inputTitle,
        TimeRange: selectedTimeRange,
        tableIndex: activeTable as number, // Chỉ số bảng (không undefined)
        selectedCells: [...selectedCells[activeTable as number]], // Lưu lại các ô đã chọn
        mergedCell: {
          startCell: Math.min(...selectedCells[activeTable as number]), // Ô đầu tiên
          endCell: Math.max(...selectedCells[activeTable as number]), // Ô cuối cùng
        },
      };
  
      setSavedData((prevData) => [...prevData, newSavedData]); // Cập nhật `savedData`
    }
  
    // Xóa các ô đã chọn khỏi trạng thái
    setSelectedCells((prevSelected) => {
      const newSelection = [...prevSelected];
      newSelection[activeTable as number] = [];
      return newSelection;
    });
  
    setInputTitle(""); // Reset tiêu đề
    closeModal(); // Đóng modal
  };
  

  const closeModal = (): void => {
    setIsModalOpen(false);
    setActiveTable(null);
  };

  const timeSlots: string[] = Array.from(
    { length: endTime + 1 - startTime },
    (_, i) => `${startTime + i}:00`
  );

  const totalCells: number = (endTime + 1 - startTime) * cellsPerHour;

  // Kiểu dữ liệu bổ sung
  interface SavedData {
    title: string;
    TimeRange: { start: string; end: string };
    tableIndex: number;
    selectedCells: number[];
    mergedCell: {
      startCell: number;
      endCell: number;
    };
  }

  return (
    <div className="container-but-bigger">
      <div className="booking-address">
        <div className="address-container">
          <div className="next-items"></div>
          <div className="address-list">
            {addressData.map((address: Address, index: number) => (
              <div className="address-items" key={index}>
                <div className="item">
                  <div className="item-left">
                    <img src={address.img} alt="Address Thumbnail" />
                  </div>
                  <div className="item-right">
                    <div className="item-right-up">
                      <p>
                        <b>{address.locationVi}</b>
                      </p>
                    </div>
                    <div className="item-right-down">
                      <p>{address.towerAddress}</p>
                      <p>{address.price}/h</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="prev-items"></div>
        </div>
      </div>
      <div
        className="booking-container"
        // onMouseUp={isModalOpen ? undefined : handleMouseUp}
        onMouseUp={isModalOpen ? undefined : () => handleMouseUp(0,3)}
        onMouseLeave={undefined}
      >
        <div className="time-labels">
          {timeSlots.map((time: string, index: number) => (
            <div key={index} className="time-label">
              {time}
            </div>
          ))}
        </div>
        <div className="table-container" ref={tableContainerRef}>
          <div className="table-items">
            {selectedCells.map((tableCells: number[], tableIndex: number) => (
              <div key={tableIndex} className="time-item">
                {Array.from({ length: totalCells }, (_, index) => {
                  const saved = savedData.find(
                    (data) =>
                      data.tableIndex === tableIndex &&
                      data.selectedCells.includes(index)
                  );
                  return (
                    <div
                      key={index}
                      className={getCellClassName(tableIndex, index)}
                      onMouseDown={() => handleMouseDown(tableIndex, index)}
                      onMouseOver={() => handleMouseOver(tableIndex, index)}
                      // onDoubleClick={() => handleDoubleClick(tableIndex, index)}
                      onClick={() => handleMouseUp(tableIndex, index)}
                      style={{ cursor: "pointer" }}
                    >
                      <span style={{ fontWeight: "bold", fontSize: "1.2em" }}>
                        #{index + 1}
                      </span>
                      {/* Hiển thị nội dung từ modal đã lưu */}
                      {saved && index === saved.selectedCells[0] ? (
                        <div>
                          <strong>{saved.title}</strong>{" "}
                          {/* Hiển thị tiêu đề từ modal */}
                          <p>
                            {saved.TimeRange.start} - {saved.TimeRange.end}
                          </p>{" "}
                          {/* Hiển thị thời gian từ modal */}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
                {renderMergedCells(tableIndex)}
              </div>
            ))}
          </div>
        </div>
        {isModalOpen && (
  <BookingModal
    isOpen={isModalOpen}
    onClose={closeModal}
    activeTable={activeTable}
    addressData={addressData}
    selectedTimeRange={selectedTimeRange}
    durationString={durationString}
    inputTitle={inputTitle}
    handleTitle={handleTitle}
    handleSave={handleSave} // Hàm xử lý lưu
    startDate={new Date().toISOString()}
  />
)}

      </div>
    </div>
  );
};

export default BookingTime;
