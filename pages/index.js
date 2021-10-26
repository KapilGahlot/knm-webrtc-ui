import React from "react"
import RTCHome from "../components/RTCHome"

const Home = () => {
    return (
        <div>
            <p className="test">Testing Styled jsx</p>
            <RTCHome />
            <style jsx>{`
                .test {
                    @apply text-blue-400
                }
            `}</style>
        </div>
    )
}

export default Home