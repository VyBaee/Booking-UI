import React, { useState } from 'react';
import logo from '../../images/CMC_logo.png';
import './hrmsHeader.css';
import { IoIosHelpCircleOutline } from "react-icons/io";
import { FaArrowDown } from "react-icons/fa";

interface UserData {
  firstName: string;
  lastName: string;
  companyName: string;
  groupName: string;
}

const Header: React.FC = () => {
  const [userData, setUserData] = useState<UserData>({
    firstName: "Thuy",
    lastName: "Pham Xuan",
    companyName: "CMC GLOBAL",
    groupName: "DKR 1",
  });

  const DisplayUser: React.FC<UserData> = ({ lastName, firstName, companyName, groupName }) => {
    const fullName = `${firstName}. ${lastName}`;
    return <>{`${fullName} - ${companyName} ${groupName}`}</>;
  };

  return (
    <div className='Header'>
      <div className='container'>
        <div className='container_left'>
          <div className='logo'>
            <img src={logo} alt='CMC Logo' />
          </div>
          <div className='navigation'>
            <div className='nav'>
              <a href='#'>Văn Phòng</a>
            </div>
            <div className='nav'>
              <a href='#'>Họp</a>
            </div>
          </div>
        </div>
        <div className='container_right'>
          <div className='get_help'>
            <IoIosHelpCircleOutline />
          </div>
          <div className='user_login'>
            <div className='user_logo'>
              <img src={logo} alt='User Logo' />
            </div>
            <div className='user_account'>
              <div className='account'>
                <p><DisplayUser {...userData} /></p>
              </div>
              <div className='user_more'>
                <FaArrowDown />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;

export {};