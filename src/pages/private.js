import React, {useState, useRef} from "react";
import { useDispatch, useSelector } from 'react-redux'
import Navbar from "../components/navbar";
import {selectAllContacts,contactAddOne,selectTotalContacts,contactUpdate, contactRemoveOne,contactSetAll} from '../store/contactSlice'
import {nanoid} from '@reduxjs/toolkit'
import { Table, Input, InputNumber, Popconfirm, Form, Button, Space } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';


const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

function Private() {
  const dispatch = useDispatch();
  const contacts = useSelector(selectAllContacts)

  const [searchText,setSearchText] = useState('')
  const [searchedColumn,setSearchedColumn] = useState('')
  const searchInputRef = useRef(); 
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');

  // Column search implementation FOLD IT !
  const getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            searchInputRef.current = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </Space>
      </div>
    ),
    
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex] ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()) : '',
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => searchInputRef.current.select());
      }
    },
    render: text =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  // Field edition implementation
  const isEditing = record => record.id === editingKey;

  const edit = record => {
    form.setFieldsValue({
      // name: '',
      // age: '',
      // address: '',
      ...record,
    });
    setEditingKey(record.id);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async id => {
    try {
      const row = await form.validateFields();
      dispatch(contactUpdate({id:id,...row}));
      setEditingKey('');
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = clearFilters => {
    clearFilters();
    setSearchText('');
  };

  const handleDelete = id => {
    dispatch(contactRemoveOne(id))
  };

  const handleAdd = () => {
    const newData = {
      id: nanoid(),
      name: '',
      username: '',
      phone: '',
      email: '',
    };
    dispatch(contactAddOne(newData))

  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      width: '20%',
      editable:true,
      ...getColumnSearchProps('name'),
    },
    {
      title: 'Username',
      dataIndex: 'username',
      editable:true,
      ...getColumnSearchProps('username'),
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      editable:true,
      ...getColumnSearchProps('phone'),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      editable:true,
      ...getColumnSearchProps('email'),
    },
    {
      title: 'Operations',
      dataIndex: 'operation',
      render: (text, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <a
              href="javascript:;"
              onClick={() => save(record.id)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </a>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Space>
          <a disabled={editingKey !== ''} onClick={() => edit(record)}>
            Edit
          </a>
            <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.id)}>
              <a>Delete</a>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const mergedColumns = columns.map(col => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: record => ({
        record,
        // inputType: col.dataIndex === 'age' ? 'number' : 'text',
        inputType: 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <div className="page-container">
      <Navbar title="Private" />
      <main className="main-container">
        {/* {contacts && contacts.map((item,idx)=><div key={idx}>{ */}
        {/* item && Object.keys(item).map((key)=> {return(<div key={key}>{key} : {item[key]}</div>)}) */}
        {/* }</div>)}   */}
        <Button
          onClick={handleAdd}
          type="primary"
          style={{ marginBottom: 16 }}
        >
          Add a row
        </Button>
        <Form form={form} component={false}>
          <Table
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            bordered
            dataSource={contacts}
            columns={mergedColumns}
            rowClassName="editable-row"
            pagination={{
              onChange: cancel,
            }}
          />
        </Form>
      </main>
    </div>
  );
}

export default Private;
