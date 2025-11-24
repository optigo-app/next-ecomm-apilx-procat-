import React from 'react'
import './PageLoader.scss';
import { CircularProgress } from '@mui/material';

const PageLoader = ({ loading }) => {
    return (
        <>
            {loading && (
                <div className="main_loader-overlay">
                    <CircularProgress sx={{ color: 'white' }} />
                </div>
            )}
        </>
    )
}

export default PageLoader