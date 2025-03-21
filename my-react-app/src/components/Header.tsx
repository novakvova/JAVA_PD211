import React from "react";
import {useSelector} from "react-redux";
import {getUser} from "../store/slices/userSlice.ts";
import { logOut } from "../store/slices/userSlice.ts";
import {useAppDispatch} from "../store";
import {useNavigate} from "react-router-dom";

const Header: React.FC = () => {
    const user = useSelector(getUser)
    const dispatcher = useAppDispatch();
    const navigate = useNavigate();
    return (
        <header className="bg-white shadow p-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800">My Website</h1>
            <nav>
                <ul className="flex gap-4">
                    <li>
                        <a href="/" className="text-gray-600 hover:text-blue-500">
                            Home
                        </a>
                    </li>
                    <li>
                        <a href="/categories" className="text-gray-600 hover:text-blue-500">
                            Категорії
                        </a>
                    </li>
                    <li>
                        <a href="/about" className="text-gray-600 hover:text-blue-500">
                            About
                        </a>
                    </li>
                    <li>
                        <a href="/contact" className="text-gray-600 hover:text-blue-500">
                            Contact
                        </a>
                    </li>

                    {user
                        ?
                        <>
                            <li>
                                <a href="/profile" className="text-gray-600 hover:text-blue-500">
                                    {user.email}
                                </a>
                            </li>
                            <li>
                                <a href="#" onClick={(e) => {
                                    e.preventDefault();
                                    dispatcher(logOut());
                                    navigate("/");
                                }} className="text-gray-600 hover:text-blue-500">
                                    Вихід
                                </a>
                            </li>
                        </>

                        :
                        <>
                            <li>
                                <a href="/login" className="text-gray-600 hover:text-blue-500">
                                    Вхід
                                </a>
                            </li>

                            <li>
                                <a href="/register" className="text-gray-600 hover:text-blue-500">
                                    Реєстрація
                                </a>
                            </li>
                        </>
                    }

                </ul>
            </nav>
        </header>
    );
};

export default Header;