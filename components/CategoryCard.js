import React from "react"

const CategoryCard = ({ category }) => {
     const { name, image, description } = category
    return (
        <div>
            <div className="card">
                <p>{name}</p>
                <img src={`http://localhost:1337${image.url}`} className="w-1/4 h-1/4"/>
                <p>{description}</p>
            </div>
            <style jsx>{`
                .card {
                    @apply w-60 h-60 border-2 border-solid border-gray-200 
                            rounded-lg shadow-sm flex flex-col justify-around items-center;
                }
            `}</style>
        </div>
    )
}

export default CategoryCard