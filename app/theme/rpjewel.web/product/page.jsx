import React from 'react'

const page = ({ params, searchParams }) => {
    return (
        <div>
            RP Jewels Products
            <pre>{JSON.stringify(params, null, 2)}</pre>
            <pre>{JSON.stringify(searchParams, null, 2)}</pre>
        </div>
    )
}

export default page
