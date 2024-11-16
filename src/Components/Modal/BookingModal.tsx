import React, { useEffect } from 'react';
import './BookingModal.css';

type TimeRange = {
  start: string;
  end: string;
};

type AddressData = {
  id: number;
  img: string;
  locationVi: string;
  towerAddress: string;
  price: string;
  seats: string;
};

type BookingModalProps = {
  isOpen: true | false;
  onClose: () => void;
  activeTable: number | null;
  addressData: AddressData[];
  selectedTimeRange: TimeRange;
  durationString: string;
  inputTitle: string;
  handleTitle: (e: React.ChangeEvent<HTMLInputElement>) => void;
  startDate: string;
  handleSave: (shouldMerge: boolean) => void; // Cập nhật hàm để nhận giá trị gộp
};


const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  activeTable,
  addressData,
  selectedTimeRange,
  durationString,
  inputTitle,
  handleTitle,
  startDate,
  handleSave,
}) => {
  const [shouldMerge, setShouldMerge] = React.useState<boolean>(false);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShouldMerge(e.target.checked); // Cập nhật trạng thái checkbox
  };

  const handleSubmit = () => {
    handleSave(shouldMerge); // Truyền trạng thái gộp vào hàm lưu
    onClose(); // Đóng modal sau khi lưu
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <div className="modal-left">
          <img src={addressData[activeTable!]?.img} alt="Meeting room" />
        </div>
        <div className="modal-right">
          <div className="modal-header">
            <div className="modal-address-name">
              <h1>{addressData[activeTable!]?.locationVi}</h1>
            </div>
            <div className="modal-address-information">
              <div>
                <p>
                  {addressData[activeTable!]?.price} VND/h -{" "}
                  {addressData[activeTable!]?.seats} seats
                </p>
                <p>{addressData[activeTable!]?.towerAddress}</p>
              </div>
            </div>
          </div>
          <hr />
          <div className="modal-body">
            <div className="modal-body-left">
              <div className="modal-body-left-title">
                <label>
                  <p style={{ fontWeight: 600 }}>
                    Title<span style={{ color: "red", marginRight: "10px" }}>*</span>
                  </p>
                </label>
                <div className="inputTitle">
                  <input
                    type="text"
                    value={inputTitle}
                    onChange={handleTitle}
                    className="input-bordered"
                    placeholder="Input the title of booking"
                  />
                </div>
              </div>
              <div className="modal-body-left-time">
                <div className="modal-body-left-time-detail">
                  <p style={{ fontWeight: 600 }}>Time</p>
                  <p>
                    {selectedTimeRange.start} - {selectedTimeRange.end}
                  </p>
                </div>
                <div className="modal-body-left-time-duration">
                  <p style={{ fontWeight: 600 }}>Duration</p>
                  <p>{durationString}</p>
                </div>
              </div>
              <div className="modal-body-email">
                <label
                  htmlFor="email"
                  className="input-email"
                  style={{ fontWeight: 600 }}
                >
                  Email to{" "}
                  <span style={{ color: "red", marginRight: "10px" }}>*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  className="input-email-field"
                  placeholder="Type @ to search for Ldap, e.g. @tho @dat"
                />
              </div>
              <div className="modal-body-recurrence">
                <label className="input-RP" style={{ fontWeight: 600 }}>
                  Recurrence Pattern:
                </label>
                <div className="choosingRP">
                  <label>
                    <input type="radio" name="recurrence" value="only" /> Only
                  </label>
                  <label>
                    <input type="radio" name="recurrence" value="daily" /> Daily
                  </label>
                  <label>
                    <input type="radio" name="recurrence" value="weekly" /> Weekly
                  </label>
                </div>
              </div>
            </div>
            <div className="modal-body-right">
              <div className="modal-body-right-time">
                <p style={{ fontWeight: 600 }}>Date:</p>
                {startDate}
              </div>
              <div className="modal-body-right-content">
                <label
                  htmlFor="contentBrief"
                  className="input-CB"
                  style={{ fontWeight: 600 }}
                >
                  Content Brief:
                </label>
                <textarea id="contentBrief" name="contentBrief"></textarea>
              </div>
            </div>
          </div>
          {/* Add footer */}
          <hr />
          <div className="modal-footer">
            <button
              className="cancel-button"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="save-button"
              onClick={handleSubmit}
            >
              Book
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
