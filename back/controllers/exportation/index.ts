import mongoose from 'mongoose'
const Excel = require('excel4node');

import Review from '@db/Review'
import ServiceProvider from '@db/Service-provider'
import S_SP from '@db/Supervisor_Service-provider'
import User from '@db/User'

import analytics from './analytics'

const ObjectId = mongoose.Types.ObjectId;


const getReviews = async (userId: string = null) => {

    return new Promise(async (resolve, reject) => {

        try {

            const workbook = new Excel.Workbook();
            const ws = workbook.addWorksheet('My Sheet');

            var style = workbook.createStyle({
                alignment: {
                },
            });

            ws.column(1).setWidth(5.2);
            ws.column(2).setWidth(24.3);
            ws.column(3).setWidth(17.3);
            ws.column(4).setWidth(117.4);
            ws.column(5).setWidth(25);
            ws.column(6).setWidth(133.7);
            ws.column(7).setWidth(7);
            ws.column(8).setWidth(11);
            ws.column(9).setWidth(34);

            ws.cell(1, 1)
                .string('№')
                .style(style);
            ws.cell(1, 2)
                .string('Область')
                .style(style);
            ws.cell(1, 3)
                .string('Район')
                .style(style);
            ws.cell(1, 4)
                .string('Услугодатель')
                .style(style);
            ws.cell(1, 5)
                .string('Тип услугодателя')
                .style(style);
            ws.cell(1, 6)
                .string('Комментарий')
                .style(style);
            ws.cell(1, 7)
                .string('Рейтинг')
                .style(style);
            ws.cell(1, 8)
                .string('Дата')
                .style(style);
            ws.cell(1, 9)
                .string('Пользователь')
                .style(style);

            let data;

            if(!userId) {
                data = await getReviewsSuperadmin()
            } else {
                data = await getReviewsSupervisor(userId)
            }


            let counter = 0;
            data.map((record, index) => {
                const row = index + 2;

                ws.cell(row, 1)
                    .number(index+1)
                    .style(style);

                ws.cell(row, 2)
                    .string(record.Region.nameRu)
                    .style(style);

                ws.cell(row, 3)
                    .string(record.Raion.nameRu)
                    .style(style);

                ws.cell(row, 4)
                    .string(record.ServiceProvider.nameRu)
                    .style(style);

                ws.cell(row, 5)
                    .string(record.ServiceProvider.ServiceProviderType.nameRu)
                    .style(style);

                ws.cell(row, 6)
                    .string(record.text)
                    .style(style);

                ws.cell(row, 7)
                    .number(record.rate)
                    .style(style)
                    .style({alignment: 'center'});

                ws.cell(row, 8)
                    .date(record.createdAt)
                    .style(style)
                    .style({numberFormat: 'dd.mm.yyyy', alignment: 3});

                if(record.User.phone && record.User.phone.mobile && record.User.phone.mobile.length) {
                    counter++;
                }

                if(record.User.phone && record.User.phone.mobile && record.User.phone.mobile.length) {
                    ws.cell(row, 9)
                        .string(record.User.phone.mobile[0])
                        .style(style);
                } else if(record.User.email) {
                    ws.cell(row, 9)
                        .string(record.User.email)
                        .style(style);
                }
            });

            console.log(counter);

            return resolve(workbook)

        } catch (err) {
            return reject(err);
        }

    });

};


const getReviewsSuperadmin= async () => {

    const data = await Review.aggregate([
        {
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
            '$lookup': {
                'from': 'service-provider-types',
                'localField': 'ServiceProvider.serviceProviderTypeId',
                'foreignField': '_id',
                'as': 'ServiceProviderType'
            }
        }, {
            '$unwind': {
                'path': '$ServiceProviderType',
                'preserveNullAndEmptyArrays': false
            }
        }, {
            '$addFields': {
                'ServiceProvider.ServiceProviderType': '$ServiceProviderType'
            }
        }, {
            '$lookup': {
                'from': 'users',
                'localField': 'userId',
                'foreignField': '_id',
                'as': 'User'
            }
        }, {
            '$unwind': {
                'path': '$User',
                'preserveNullAndEmptyArrays': false
            }
        }, {
            '$lookup': {
                'from': 'navs',
                'localField': 'ServiceProvider.navId',
                'foreignField': '_id',
                'as': 'Raion'
            }
        }, {
            '$unwind': {
                'path': '$Raion',
                'preserveNullAndEmptyArrays': false
            }
        }, {
            '$lookup': {
                'from': 'navs',
                'localField': 'Raion.prevId',
                'foreignField': '_id',
                'as': 'Region'
            }
        }, {
            '$unwind': {
                'path': '$Region',
                'preserveNullAndEmptyArrays': false
            }
        },
    ]);

    return data

};


const getReviewsSupervisor = async (userId: string) => {

    const data = await S_SP.aggregate([
        {
            '$match': {
                'userId': new ObjectId(userId)
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
            '$replaceRoot': {
                'newRoot': '$ServiceProvider'
            }
        }, {
            '$match': {
                'suspended': false
            }
        }, {
            '$lookup': {
                'from': 'reviews',
                'localField': '_id',
                'foreignField': 'serviceProviderId',
                'as': 'Reviews'
            }
        }, {
            '$unwind': {
                'path': '$Reviews',
                'preserveNullAndEmptyArrays': false
            }
        }, {
            '$addFields': {
                'Reviews.ServiceProvider._id': '$_id',
                'Reviews.ServiceProvider.navId': '$navId',
                'Reviews.ServiceProvider.nameRu': '$nameRu',
            }
        }, {
            '$replaceRoot': {
                'newRoot': '$Reviews'
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
            '$lookup': {
                'from': 'users',
                'localField': 'userId',
                'foreignField': '_id',
                'as': 'User'
            }
        }, {
            '$unwind': {
                'path': '$User',
                'preserveNullAndEmptyArrays': false
            }
        }, {
            '$lookup': {
                'from': 'navs',
                'localField': 'ServiceProvider.navId',
                'foreignField': '_id',
                'as': 'Raion'
            }
        }, {
            '$unwind': {
                'path': '$Raion',
                'preserveNullAndEmptyArrays': false
            }
        }, {
            '$lookup': {
                'from': 'navs',
                'localField': 'Raion.prevId',
                'foreignField': '_id',
                'as': 'Region'
            }
        }, {
            '$unwind': {
                'path': '$Region',
                'preserveNullAndEmptyArrays': false
            }
        }, {
            '$lookup': {
                'from': 'service-provider-types',
                'localField': 'ServiceProvider.serviceProviderTypeId',
                'foreignField': '_id',
                'as': 'ServiceProviderType'
            }
        }, {
            '$unwind': {
                'path': '$ServiceProviderType',
                'preserveNullAndEmptyArrays': false
            }
        }, {
            '$addFields': {
                'ServiceProvider.ServiceProviderType': '$ServiceProviderType'
            }
        },
    ]);

    return data
};


export = {
    getReviews,
    getServiceProviders,
    ...analytics
}