import { FilterGetOneCategory } from "../inputs/sectionAndCategoryTypes";
import { IProduct } from "../interfaces/IProduct";

export const filterProducts = (products: IProduct[], filter: FilterGetOneCategory) => {
    return products.filter(product => {
        let isValid = true;

        filter.inputFields.forEach(field => {
            if (field.chosen && product[field.field as keyof IProduct] !== field.chosen) {
                isValid = false;
            }
        });

        filter.selects.forEach(select => {
            if (select.chosen && product[select.field as keyof IProduct] !== select.chosen) {
                isValid = false;
            }
        });

        filter.minMax.forEach(range => {
            if (range.chosen) {
                const min = range.chosen.min;
                const max = range.chosen.max;
                const value = product[range.field as keyof IProduct];

                if ((min !== undefined && value < min) || (max !== undefined && value > max)) {
                    isValid = false;
                }
            }
        });

        return isValid;
    });
}
