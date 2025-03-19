import {ReactNode} from "react";

export interface IUserRegisterRequest {
    username: string;         // Назва категорії (обов'язкове поле)     // Унікальний ідентифікатор (обов'язкове поле)
    password: string;
}

export interface IUserLoginRequest {
    username: string;         // Назва категорії (обов'язкове поле)     // Унікальний ідентифікатор (обов'язкове поле)
    password: string;
}


export interface LoginButtonProps{
    title:string
    onLogin:(token: string) => void
    icon: ReactNode
}

export interface LoginGoogleRequest{
    token:string
}

export interface AuthResponse{
    token:string
}

export interface IUser {
    id: number;
    email: string;
    roles: string[];
}