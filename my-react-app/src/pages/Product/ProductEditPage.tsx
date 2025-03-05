import React, {useEffect, useState} from "react";
import {Button, Form, Input, Select, Upload, UploadFile} from "antd";
import {IProductEdit} from "./types.ts";
import TextArea from "antd/es/input/TextArea";
import {useNavigate, useParams} from "react-router-dom";
import {useEditProductMutation, useGetProductByIdQuery} from "../../services/productsApi.ts";
import {useGetCategoriesQuery} from "../../services/apiCategory.ts";

import {PlusOutlined} from '@ant-design/icons';
import {DragDropContext, Draggable, Droppable, DropResult} from "@hello-pangea/dnd";
import {APP_ENV} from "../../env";

const {Item} = Form;

const ProductEditPage : React.FC = () => {

    const {id} = useParams();
    //console.log("Id", id);
    const {data: categories, isLoading: categoriesLoading, error: categoriesError} = useGetCategoriesQuery();
    const {data: product, isLoading: productLoading, error: productError} = useGetProductByIdQuery(id!);
    const [form] = Form.useForm<IProductEdit>();
    const [selectedFiles, setSelectedFiles] = useState<UploadFile[]>([]);
    const navigate = useNavigate();
    const [editProduct, {isLoading: productIsLogding}] = useEditProductMutation();

    console.log("Product edit", product);
    useEffect(() => {
        if(product) {
            form.setFieldsValue({...product});
            const files = product?.images.map(x=>({
                uid: x,
                url: `${APP_ENV.REMOTE_BASE_URL}/images/medium/${x}`,
                originFileObj: new File([new Blob([''])],x,{type: 'old-image'})
            }) as UploadFile);
            setSelectedFiles(files);
        }
    },[product]);

    const onFinish = async (values: IProductEdit) => {
        try {
            values.images = selectedFiles.map(x=>x.originFileObj as File);
            values.id = product!.id;
            console.log("Server send data: ", values);
            const response = await editProduct(values).unwrap();
            console.log("Категорія успішно створена:", response);
            navigate("..");
        } catch (error) {
            console.error("Помилка під час створення категорії:", error);
        }
    }

    const categoriesData = categories?.map(item => ({
        label: item.name,
        value: item.id,
    }));

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;
        const reorderedFiles = Array.from(selectedFiles);
        const [movedFile] = reorderedFiles.splice(result.source.index, 1);
        reorderedFiles.splice(result.destination.index, 0, movedFile);

        setSelectedFiles(reorderedFiles);
    };


    const handleImageChange = (info: { fileList: UploadFile[] }) => {
        const newFileList = info.fileList.map((file, index) => ({
            ...file,
            uid: file.uid || Date.now().toString(),
            order: index,
        }));

        setSelectedFiles([...selectedFiles, ...newFileList]);
    };

    if(productLoading)
        return <p>Product loading...</p>;

    if(productError)
        return <p>Error loading data...</p>;

    return (
        <>
            <h1 className={"text-center text-4xl font-bold text-blue-500"}>Редагування товару</h1>

            <div style={ {maxWidth:'600px', margin:'0 auto'}}>
                <Form
                    form={form}
                    onFinish={onFinish}
                    layout="vertical">
                    <Item
                        name="name"
                        label={"Назва товару"}
                        rules={[
                            {required:true, message:"Вкажіть назву категорії"}
                        ]}>
                        <Input placeholder={"Назва"}/>
                    </Item>

                    <Item
                        name="price"
                        label={"Ціна товару"}
                        rules={[
                            {required:true, message:"Вкажіть ціну категорії"}
                        ]}>
                        <Input placeholder={"Ціна"}/>
                    </Item>

                    {categoriesLoading ? (
                        <p>Loading categories...</p>
                    ) : categoriesError ? (
                        <p className="text-red-500">Failed to load categories</p>
                    ) : (
                        <Form.Item
                            label="Категорія"
                            name="categoryId"
                            htmlFor="categoryId"
                            rules={[{required: true, message: "Це поле є обов'язковим!"}]}
                        >
                            <Select placeholder="Оберіть категорію: " options={categoriesData}/>
                        </Form.Item>
                    )}

                    <Item
                        name="description"
                        label={"Опис"}>
                        <TextArea placeholder={"Опис..."} rows={4}/>
                    </Item>

                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="upload-list" direction="horizontal">
                            {(provided) => (
                                <div ref={provided.innerRef} {...provided.droppableProps} className="flex flex-wrap gap-2">
                                    {selectedFiles.map((file, index) => (
                                        <Draggable key={file.uid} draggableId={file.uid} index={index}>
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                >
                                                    <Upload
                                                        listType="picture-card"
                                                        fileList={[file]}
                                                        onRemove={() => {
                                                            const newFileList = selectedFiles.filter(f => f.uid !== file.uid);
                                                            setSelectedFiles(newFileList);
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>

                    <Upload
                        multiple
                        listType="picture-card"
                        beforeUpload={() => false}
                        onChange={handleImageChange}
                        fileList={[]}
                        accept="image/*"
                    >
                        <div>
                            <PlusOutlined/>
                            <div style={{marginTop: 8}}>Додати</div>
                        </div>
                    </Upload>


                    <Item>
                        <Button type="primary" htmlType="submit"
                                disabled={productIsLogding}>
                            {productIsLogding ? 'Збереження...' : 'Зберегти продукт'}
                        </Button>
                    </Item>
                </Form>
            </div>
        </>
    )
}

export default ProductEditPage;