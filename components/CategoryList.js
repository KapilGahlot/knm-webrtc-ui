import React from "react"
import CategoryCard from "./CategoryCard"

const CategoryList = ({ categories }) => {
    console.log("categories : ", categories)
    return (
        <div>
            <div className="container">
                {categories.map(category => (<CategoryCard key={category.name} category={category} />))}
           </div>
            <style jsx>{`
                .container {
                    @apply mt-10 flex flex-row flex-wrap justify-around items-center;
                }
            `}</style>
        </div>
    )
}

export default CategoryList