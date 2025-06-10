import React from 'react'
import { IDish } from './types'
import DishCard from './DishCard'

interface DishesSectionProps {
  dishes: IDish[]
  title: string
}

const DishesSection: React.FC<DishesSectionProps> = ({ dishes, title }) => {
  if (!dishes || dishes.length === 0) return null

  return (
    <section className="px-4 mb-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">{title}</h2>
      <div className="grid grid-cols-1 gap-6">
        {dishes.map((dish) => (
          <DishCard key={dish._id} dish={dish} />
        ))}
      </div>
    </section>
  )
}

export default DishesSection