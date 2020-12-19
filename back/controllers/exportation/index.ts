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