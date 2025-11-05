// @ts-nocheck
import React from 'react';
import { Result } from '@wind/wind-ui';
import { useAuth } from './useAuth';

/**
 * @description 南京政务平台自动登录检查组件
 */
const AuthCheck: React.FC = () => {
    const { title, handleDebugClick } = useAuth();

    return (
        <div
            style={{
                position: 'absolute',
                top: '40%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
            }}
            onClick={handleDebugClick}
        >
            <Result status="developing" title={title} />
        </div>
    );
};

export default AuthCheck;