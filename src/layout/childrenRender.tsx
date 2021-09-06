import { SyncOutlined } from '@ant-design/icons';
import { RouteContext } from '@ant-design/pro-layout';
import { Tabs } from 'antd';
import { useState, useEffect } from 'react';
import React, { Component } from 'react';
import { history } from 'umi';
import store from 'store'
import './style.less';

const { TabPane } = Tabs;

class RefreshComponent extends Component<{ renderKey: string }> {

    render() {
        const { renderKey, children } = this.props;
        return (
            <div key={renderKey}>{children}</div>
        );
    }
}

const TabContainer = (props) => {
    const userSettings = store.get('user-settings') || {};
    const { title, location, children } = props;
    const { pathname } = location;
    const [activeKey, setActiveKey] = useState(userSettings.activeKey);
    const [panes, setPanes] = useState(userSettings.panes || []);
    const [components, setComponents] = useState({});

    if (userSettings && userSettings.reset) {
        setActiveKey('');
        setPanes([]);
        setComponents([]);
        store.set('user-settings', { panes: [], activeKey: '', reset: false });
        // console.log('reset multitabs');
    }

    // useEffect(() => {
    //     console.log(JSON.stringify(userSettings));
    // }, []);

    /**
     * 新增tab页面时触发
     */
    useEffect(() => {
        editActions.add(title);
        addChildren();

        // ugly but usefully
        setTimeout(() => {
            const pane = panes.find((item) => {
                return item.pathname === pathname;
            });
            if (pane && pane.key !== activeKey)
                setActiveKey(pane.key);
        }, 100);

    }, [pathname]);

    /**
     * 删除tab页面或刷新tab页面触发
     */
    useEffect(() => {
        addChildren();
        userSettings.panes = panes;
        store.set('user-settings', userSettings);
    }, [panes]);

    /**
     * 切换页面时触发
     */
    useEffect(() => {
        addChildren();
        const pane = panes.find((item) => {
            return item.key === activeKey;
        });

        // 同步menu位置和page title
        if (pane)
            history.replace(pane.pathname);

        userSettings.activeKey = activeKey;
        store.set('user-settings', userSettings);
    }, [activeKey]);

    /**
     * 将children添加到state对象中
     */
    const addChildren = () => {
        if (children) {
            const pane = panes.find(item => item.pathname === children.props.location.pathname);
            if (pane) {
                setComponents({
                    ...components,
                    [pane.key]: <RefreshComponent renderKey={pane.randomKey}>{children}</RefreshComponent>,
                })
            }
        }
    };

    /**
     * 从state对象中查找component
     */
    const getPaneContent = (pane) => {
        const comp = components[pane.key];
        if (comp) {
            return comp;
        }
    };

    // tab组件事件

    const onChange = activeKey => {
        setActiveKey(activeKey);
    };

    const onChangePanes = panes => {
        setPanes(panes);
    };

    const onRefresh = pane => {
        setPanes(panes.map(item => item.key === pane.key ? { ...pane, randomKey: Math.random() } : item));
    };

    const onEdit = (targetKey, action) => {
        editActions[action](targetKey);
    };

    const add = (tabKey) => {
        if (!panes.find(pane => pane.key === tabKey)) {
            const randomKey = Math.random();
            setPanes([
                ...panes,
                { title: tabKey, pathname: location.pathname, key: tabKey, refreshKey: randomKey }
            ]);
            onChange(tabKey);
        }
    };

    const remove = targetKey => {
        let lastIndex;
        panes.forEach((pane, i) => {
            if (pane.key === targetKey) {
                lastIndex = i - 1;
            }
        });
        let tabKey;
        const newPanes = panes.filter(pane => pane.key !== targetKey);
        onChangePanes(newPanes);
        if (newPanes.length && activeKey === targetKey) {
            if (lastIndex >= 0) {
                tabKey = newPanes[lastIndex].key;
            } else {
                tabKey = newPanes[0].key;
            }
            onChange(tabKey);
        }
    };

    const editActions = {
        add,
        remove,
    };

    return (
        <div className="antd-pro-multitabs-container">
            <Tabs
                hideAdd
                onChange={onChange}
                activeKey={activeKey}
                type="editable-card"
                onEdit={onEdit}
            >
                {panes.map(pane => (
                    <TabPane tab={pane.key === activeKey ?
                        <span>
                            <a onClick={() => onRefresh(pane)}><SyncOutlined /></a>
                            {pane.title}
                        </span> : pane.title
                    } key={pane.key}>
                        {getPaneContent(pane)}
                    </TabPane>
                ))}
            </Tabs>
        </div>
    );
}

const childrenRender = (children) => {
    return <RouteContext.Consumer>
        {(value: any) => {
            const { currentMenu, location } = value;
            const isIgnorePath = (pathname) => {
                return pathname === '/' || pathname.match(/login|logout/);
            }

            // login page trigger multitabs reset
            if (location.pathname.match(/login/)) store.set('user-settings', { reset: true });

            return isIgnorePath(location.pathname) ? children :
                <TabContainer title={value.title} location={location}>{children}</TabContainer>;
            // return children;
        }}
    </RouteContext.Consumer>
}

export default childrenRender;
