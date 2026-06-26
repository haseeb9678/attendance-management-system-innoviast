import React, { useEffect } from 'react'

const DisableUI = ({
    setDisable,
    isBlack = false,
    opacity = 40
}) => {

    useEffect(() => {
        document.body.style.overflow = "hidden"
        return () => {
            document.body.style.overflow = "auto"
        }
    }, [])
    return (
        <div
            onClick={() => setDisable(false)}
            className={`fixed inset-0 z-5 ${isBlack ? "bg-black" : ""}`}
            style={{
                opacity: opacity / 100,
            }}
        />
    )
}

export default DisableUI