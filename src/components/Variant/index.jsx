import Button from '@mui/material/Button';
import { useCallback, useEffect } from 'react';
import { cartesianProduct, findUnavailableCombinations } from '../../utils/variant';


export default function Variant({ variantName,
    variationTypes, unavailableComb, selectedVariants, setSelectedVariants, variation,
    indexVariantName
}) {
    // Handling Disabled State for Attributes
    const handleDisabledState = (
        attributeName,
        value,
        index
    ) => {
        const upperAttributes = Object.keys(variationTypes).slice(0, index + 1);
        const fixedAttributes = {};

        upperAttributes.forEach((attr) => {
            fixedAttributes[attr] = selectedVariants[attr];
        });

        fixedAttributes[attributeName] = value;
        return areAllCombinationsUnavailable(fixedAttributes);
    };

    // Checking for Unavailable Combinations for Multiple Attributes
    const areAllCombinationsUnavailable = useCallback(
        (attributes) => {
            const totalCombinations = getNoOfTotalPossibleCombForAttrValue(Object.keys(attributes), attributes);
            const unavailableCount = noOfUnavaiCombForAttrValue(Object.keys(attributes), attributes);
            // console.log("totalCOmb", totalCombinations)
            return totalCombinations === unavailableCount;
        },
        [unavailableComb, variationTypes]
    );

    const getNoOfTotalPossibleCombForAttrValue = (keys, attributes) => {
        var values = []
        keys.forEach(
            key => {
                var temp = [attributes[key]];
                values.push(temp)
            }
        )
        const restKey = Object.keys(variationTypes).filter(k =>
            !keys.find(ks => ks == k)
        )
        const restValue = restKey.map(key => variationTypes[key])
        const valuesComb = []
        values.forEach(
            v =>
                valuesComb.push(v)
        )
        restValue.forEach(
            v =>
                valuesComb.push(v)
        )
        // console.log("valuecon", valuesComb)
        var allPossibleComb = cartesianProduct(valuesComb)
        return allPossibleComb.length
    }

    const noOfUnavaiCombForAttrValue = (keys, attributes) => {
        var values = []
        keys.forEach(
            key => {
                var temp = [attributes[key]];
                values.push(temp)
            }
        )
        const restKey = Object.keys(variationTypes).filter(k =>
            !keys.find(ks => ks == k)
        )
        const restValue = restKey.map(key => variationTypes[key])
        const valuesComb = []
        values.forEach(
            v =>
                valuesComb.push(v)
        )
        restValue.forEach(
            v =>
                valuesComb.push(v)
        )
        var allPossibleComb = cartesianProduct(valuesComb)
        const unvailableComb = findUnavailableCombinations(variationTypes, variation, allPossibleComb)
        return unavailableComb.length
    }
    //Checking if a Combination is Unavailable
    const isCombinationUnavailable = (
        selectedAttributes,
        unavailableCombinations
    ) => {
        if (!unavailableCombinations || unavailableCombinations.length === 0)
            return false;

        const selectedEntries = Object.entries(selectedAttributes);

        return unavailableCombinations.some((combination) => {
            return selectedEntries.every(([attribute, value]) => {
                return combination.combination[attribute] === value;
            });
        });
    };

    //Handling Attribute Selection
    const handleAttributeSelection = (attributeName, value) => {
        console.log(attributeName, value)
        setSelectedVariants((prevSelected) => {
            console.log("prev", prevSelected);
            const newSelected = { ...prevSelected, [attributeName]: value };

            if (!isCombinationUnavailable(newSelected, unavailableComb)) {
                return newSelected;
            }
            return prevSelected; // If unavailable, keep the previous selection
        });
    };
    console.log("slectted", selectedVariants)
    return (
        <>
            {
                variationTypes[variantName]?.map(
                    (value, index) => {
                        const isSelected = selectedVariants[variantName] === value;
                        const isDisabled = isCombinationUnavailable(
                            { ...selectedVariants, [variantName]: value },
                            unavailableComb
                        );
                        const disableState = handleDisabledState(variantName, value, indexVariantName)
                        // console.log("disable", disableState)
                        return (
                            disableState == false && (
                                <Button
                                    key={index}
                                    onClick={() =>
                                        !isDisabled && handleAttributeSelection(variantName, value)
                                    }
                                    variant={isSelected ? "contained" : "outlined"}
                                    disabled={isDisabled}
                                    color='success'
                                    className='me-1'
                                >
                                    <div
                                    >
                                        {value}
                                    </div>
                                </Button>
                            )
                        )

                    }
                )
            }
        </>
    )
}