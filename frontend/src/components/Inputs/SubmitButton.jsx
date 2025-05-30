import React from 'react'

const SubmitButton = ({ loading }) => {
    return (
        <div className="flex items-center justify-end">
            <button className="mt-4 bg-primary text-white px-5 py-2 w-fit rounded-sm  hover:bg-primary/90 transition duration-200 cursor-pointer"
                type="submit"
                disabled={loading}
            >
                Submit
            </button>
        </div>
    )
}

export default SubmitButton