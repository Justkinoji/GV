interface FilterInput {
    inputFields: {
        placeholder: String,
        field: String
    }[],
    selects: {
        placeholder: String,
        values: String[],
        field: String
    }[],
    minMax: {
        field: String
    }[]
}

interface CreateSectionInput {
    name: string;
    description: string;
    imageUrl: string;
    logoUrl: string;
    filters: FilterInput;
}

interface ChangeSectionInput {
    _id: string;
    name: string;
    description: string;
    imageUrl: string;
    logoUrl: string;
    filters: FilterInput;
}

interface CategoryInput {
    categoryName: string;
    sectionName: string;
    fee: number;
}

interface CategoryUpdateInput {
    _id: string;
    name: string;
    fee: number;
}

interface FilterGetOneCategory {
    inputFields: {
        placeholder: String,
        field: String,
        chosen: String
    }[],
    selects: {
        placeholder: String,
        values: String[],
        field: String,
        chosen: String
    }[],
    minMax: {
        field: String,
        chosen: {
            min: number,
            max: number
        }
    }[]
}

interface GetOneCategoryInput {
    id: string;
    productsPerPage?: number;
    page?: number;
    filter?: FilterGetOneCategory;
}

export
{
    ChangeSectionInput,
    CategoryInput,
    CategoryUpdateInput,
    CreateSectionInput,
    GetOneCategoryInput,
    FilterGetOneCategory
};
