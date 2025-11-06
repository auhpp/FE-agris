export function cartesianProduct(arrays) {
    return arrays.reduce(
        (acc, curr) => acc.flatMap((x) => curr.map((y) => [...x, y])),
        [
            []
        ]
    );
}

export function findUnavailableCombinations(
    variationTypes,
    variations, allCombinationsParam
) {
    var allCombinations = []
    if (!allCombinationsParam) {
    const keys = Object.keys(variationTypes);
    const values = keys.map(key => variationTypes[key]);
        // Generate all possible combinations
        allCombinations = cartesianProduct(values).map(combination =>
            keys.reduce((obj, key, index) => {
                obj[key] = combination[index];
                return obj;
            }, {})
        );
    }else{
        allCombinations = allCombinationsParam
    }
    // Create a map of available variations for quick lookup
    const variationsCheck = variations?.map(
        v => {
            var variation = {
                stock: v.stock
            }
            var variType = {}
            v.variantValues.forEach(
                it => {
                    variType[it.name] = it.value
                }
            )
            variation.variationType = variType
            return variation
        }
    )
    const availableCombinationsMap = new Map(
        variationsCheck?.map(v => [JSON.stringify(v.variationType), {
            stock: v.stock
        }])
    );

    // Initialize the array for storing unavailable combinations
    const unavailableCombinations = [];

    // Check all possible combinations
    for (const combination of allCombinations) {
        const combinationStr = JSON.stringify(combination);
        const available = availableCombinationsMap.get(combinationStr);

        if (!available) {
            unavailableCombinations.push({
                combination,
                reason: "Missing",
            });
        } else if (available.stock <= 0) {
            unavailableCombinations.push({
                combination,
                reason: "Out of stock",
            });
        }
    }


    return unavailableCombinations;
}


export function convertToVariantType(variants) {
    var variationTypes = {};
    variants.forEach(element => {
        element.variantValues.forEach(
            variant => {
                if (!variationTypes[variant.name]) {
                    variationTypes[variant.name] = []
                }
                if (!variationTypes[variant.name].find((e) => e == variant.value)) {
                    variationTypes[variant.name] = [...variationTypes[variant.name], variant.value]
                }
            }
        )
    })
    return variationTypes;
}

export function getVariantIdSelected(variations, selectedVariants){
    const variationsCheck = variations?.map(
        v => {
            var variation = {
                id: v.id
            }
            var variType = {}
            v.variantValues.forEach(
                it => {
                    variType[it.name] = it.value
                }
            )
            variation.variationType = variType
            return variation
        }
    )
    const availableCombinationsMap = new Map(
        variationsCheck?.map(v => [JSON.stringify(v.variationType), {
            id: v.id
        }])
    );
    const combinationStr = JSON.stringify(selectedVariants);
    const available = availableCombinationsMap.get(combinationStr);
    return available?.id
}

export function convertToSelectedVariantString (variantValues) {
    var selectVariant = {}
    variantValues?.forEach(
        a => {
            selectVariant[a.name] = a.value
        }
    )
    var res = ""
    var keys = Object.keys(selectVariant)
    var temp = keys.map(key => selectVariant[key])
    res = temp.join(", ")
    return res;
  }

  export function convertToSelectedVariant (variantValues) {
    var selectVariant = {}
    variantValues?.forEach(
        a => {
            selectVariant[a.name] = a.value
        }
    )
    return selectVariant;
  }