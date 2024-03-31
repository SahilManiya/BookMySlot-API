class ApiFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    search() {
        const { keyword, date, theater , location } = this.queryStr;
        if (keyword) {
            this.query = this.query.find({
                $or: [
                    { movie: { $regex: keyword, $options: 'i' } },
                    { description: { $regex: keyword, $options: 'i' } },
                ]
            });
        }

        if (date) {
            this.query = this.query.find({ 'dateAndTime.date': date });
        }

        if (theater) {
            this.query = this.query.find({ theater: theater });
        }
        if (location) {
            this.query = this.query.find({location : location});
        }
        return this;
    }

    filter() {
        const queryCopy = { ...this.queryStr };
        const excludedFields = ['keyword', 'page', 'limit', 'date', 'theater'];
        excludedFields.forEach((field) => delete queryCopy[field]);

        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

        this.query = this.query.find(JSON.parse(queryStr));
        
        return this;
    }

    pagination(resultPerPage) {
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = resultPerPage * (currentPage - 1);

        this.query = this.query.limit(resultPerPage).skip(skip);
        return this;
    }

}

export default ApiFeatures;