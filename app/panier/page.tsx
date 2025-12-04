import Panier from '@/components/ecommerce/panier/Panier'
import React from 'react'

const PanierPage = () => {
    return (
        <div className="min-h-[80vh] bg-background">
            <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
                <Panier />
            </div>
        </div>
    )
}

export default PanierPage