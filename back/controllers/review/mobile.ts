import Review from "../../models/Review";
import mongoose from "mongoose";

import ObjectId = mongoose.Types.ObjectId;

const getMyReviews = async (userId: string) => {

    return new Promise(async (resolve, reject) => {

        try {

            const reviews = await Review.aggregate([
                {
                  '$match': {
                    'userId': new ObjectId(userId)
                  }
                }, {
                  '$project': {
                    'rate': 1, 
                    'createdAt': 1, 
                    'status': 1, 
                    'serviceProviderId': 1
                  }
                }, {
                  '$lookup': {
                    'from': 'service-providers', 
                    'localField': 'serviceProviderId', 
                    'foreignField': '_id', 
                    'as': 'ServiceProvider'
                  }
                }, {
                  '$unwind': {
                    'path': '$ServiceProvider', 
                    'preserveNullAndEmptyArrays': false
                  }
                }, {
                  '$addFields': {
                    'serviceProviderRu': '$ServiceProvider.nameRu', 
                    'serviceProviderKz': '$ServiceProvider.nameKz', 
                    'address': '$ServiceProvider.address', 
                    'image': '$ServiceProvider.image'
                  }
                }, {
                  '$project': {
                    'ServiceProvider': 0
                  }
                }, {
                  '$sort': {
                    'createdAt': -1
                  }
                }, {
                  '$addFields': {
                    'yearMonthDay': {
                      '$dateToString': {
                        'format': '%Y-%m-%d', 
                        'date': '$createdAt'
                      }
                    }
                  }
                }, {
                  '$group': {
                    '_id': '$yearMonthDay', 
                    'reviews': {
                      '$push': {
                        '_id': '$_id', 
                        'serviceProviderRu': '$serviceProviderRu', 
                        'serviceProviderKz': '$serviceProviderKz', 
                        'address': '$address', 
                        'rate': '$rate', 
                        'image': '$image', 
                        'status': '$status', 
                        'createdAt': '$createdAt'
                      }
                    }
                  }
                }, {
                    '$project': {
                      '_id': 0, 
                      'date': '$_id', 
                      'reviews': 1
                    }
                }, {
                    '$sort': {
                      'date': -1
                    }
                }
              ]);

            return resolve(reviews);

        } catch (err) {
            return reject(err);
        }

    });
};

export = {
    getMyReviews
}