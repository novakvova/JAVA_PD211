export interface ICategoryItem {
    id: number;                  // Унікальний ідентифікатор категорії (можна додати якщо є поле 'id')
    name: string;                // Назва категорії     // URL-ідентифікатор
    description?: string;        // Опис (може бути відсутній)
    image: string;
}


export interface ICategoryPostRequest {
    name: string;         // Назва категорії (обов'язкове поле)     // Унікальний ідентифікатор (обов'язкове поле)
    description?: string;
    image: string;
}

export interface ICategoryPutRequest extends Partial<ICategoryPostRequest> {
    id: number;
}