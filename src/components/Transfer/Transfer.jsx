import React from "react";
import { Transfer, Tooltip } from "antd";
import PropTypes from "prop-types";

export default class TransferWrap extends React.Component {
    static propTypes = {
        dataSource: PropTypes.array,
        showCheckbox: PropTypes.bool,
        titles: PropTypes.array,
        targetKeys: PropTypes.array,
        disabled: PropTypes.bool,
        onChange: PropTypes.func,
        onScroll: PropTypes.func,
        locale: PropTypes.object,
        showSearch: PropTypes.bool,
        listStyle: PropTypes.object,
        className: PropTypes.string 
    };
    static defaultProps = {
        dataSource: [],
        showCheckbox: false,
        titles: ["源列表", "目的列表"],
        targetKeys: [],
        disabled: false,
        showSearch: false,
        onChange: () => {},
        onScroll: () => {},
        locale: {
            itemUnit: "条",
            itemsUnit: "条",
            notFoundContent: "列表为空",
            searchPlaceholder: "请输入搜索内容"
        },
        listStyle: {},
        className: ""
    };

    constructor(props) {
        super(props);
        this.state = {
            targetKeys: this.props.targetKeys,
            selectedKeys: [],
            sourceSelectedKeys: [],
            targetSelectedKeys: []
        };
        this.totalColSpan = 0;
        this.json = {};// 提交时获取的表单值
        this.formRef=null
    }

    handleChange = (nextTargetKeys, direction, moveKeys) => {
        this.setState({ targetKeys: nextTargetKeys });
        this.props.onChange(nextTargetKeys, direction, moveKeys);
    };

    handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
        this.setState({
            selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys],
            sourceSelectedKeys,
            targetSelectedKeys
        });
    };

    // 双击事件
    dbClick=(id)=> {
        if (this.state.targetKeys.indexOf(id) === -1) {
            if (this.state.sourceSelectedKeys.length === 0) {
                // 没有选中双击左边一条
                this.handleChange([id, ...this.state.targetKeys],"right",[id]);
            } else {
                // 有选中双击左边
                this.handleChange([
                    ...this.state.sourceSelectedKeys,
                    ...this.state.targetKeys
                ],"right",this.state.sourceSelectedKeys);
                const arr = this.state.selectedKeys;
                this.state.sourceSelectedKeys.map(item =>
                    arr.splice(arr.indexOf(item), 1)
                );
                this.setState({ selectedKeys: arr });
            }
        } else {
            // eslint-disable-next-line no-lonely-if
            if (this.state.targetSelectedKeys.length === 0) {
                // 没有选中双击右边一条
                const arr = this.state.targetKeys;

                arr.splice(arr.indexOf(id), 1);

                this.handleChange(arr,"left",[id]);
            } else {
                // 有选中双击右边
                const arr = this.state.targetKeys;
                this.state.targetSelectedKeys.map(item =>
                    arr.splice(arr.indexOf(item), 1)
                );

                this.handleChange(arr,"left",this.state.targetSelectedKeys);

                const selectedArr = this.state.selectedKeys;
                this.state.targetSelectedKeys.map(item =>
                    selectedArr.splice(selectedArr.indexOf(item), 1)
                );
                this.setState({ selectedKeys: selectedArr });
            }
        }
    }
    filterOption = (inputValue, option) =>{
        return  option.label.indexOf(inputValue) > -1;
    }

    render() {
        const { targetKeys, selectedKeys } = this.state;
        const {
            showCheckbox=false,
            showSearch=false,
            titles,
            dataSource,
            disabled,
            onScroll,
            locale,
            listStyle,
            className
        } = this.props;

        return (
            <Transfer
                className={showCheckbox ? `${className}` : `${className} hide-transfer-checkbox`}
                dataSource={dataSource}
                disabled={disabled}
                filterOption={this.filterOption}
                listStyle={listStyle}
                locale={locale}
                onChange={this.handleChange}
                onScroll={onScroll}
                onSelectChange={this.handleSelectChange}
                render={item => (
                    <Tooltip title={item.description}>
                        <span onDoubleClick={() => this.dbClick(item.key)}>
                            {item.label}
                        </span>
                    </Tooltip>
                )}
                selectedKeys={selectedKeys}
                showSearch={showSearch}
                targetKeys={targetKeys}
                titles={titles}
            />
        );
    }
}
