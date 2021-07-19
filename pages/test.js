import React from "react"

const Test = () => {
    return (
        <div>
            <p className="test">Testing Styled jsx</p>
            <style jsx>{`
                .test {
                    @apply text-green-400
                }
            `}</style>
        </div>
    )
}

export default Test