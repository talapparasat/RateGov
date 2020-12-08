import {createSchema, ExtractProps, Type, typedModel, } from 'ts-mongoose';
import ServiceProviderType from "@db/Service-provider-type";
import OSP from "@db/Organization_Service-provider";
import Nav from "@db/Nav";

var min = [0, 'The value of path `{PATH}` ({VALUE}) is beneath the limit ({MIN}).'];
var max = [5, 'The value of path `{PATH}` ({VALUE}) exceeds the limit ({MAX}).'];

const ServiceProvider = createSchema({
    nameKz: Type.string({
        required: true,
        unique: true
    }),
    nameRu: Type.string({
        required: true,
        unique: true
    }),
    info: Type.string({
        required: false
    }),
    address: Type.string({
        required: true
    }),
    navId: Type.ref(Type.objectId({
        required: false,
    })).to('Nav', Nav),
    coordinates: Type.array({
        required: false
    }).of(Number),
    workHours: Type.array().of({
        start: Type.string({
            required: false
        }),
        end: Type.string({
            required: false
        }),
        isWorkDay: Type.boolean({
            default: false
        })
    }),
    serviceProviderTypeId: Type.ref(Type.objectId({
        required: false,
        default: null
    })).to('Service-provider-type', ServiceProviderType),
    image: Type.string({
        required: false,
    }),
    rate: Type.number({
        required: true,
        default: 0,
        min: min,
        max: max
    }),
    reviewCount: Type.number({
        required: true,
        default: 0,
        min: min
    }),
    suspended: Type.boolean({
        required: true,
        default: false
    }),
    approved: Type.boolean({
        required: true,
        default: false
    })
},{
    timestamps: {createdAt: 'createdAt'}
});

// ServiceProvider.methods.getOrganization = async () => {
//     const organization = await OSP.find({
//         serviceProviderId: this._id
//     })
// };


export default typedModel('Service-provider', ServiceProvider);

export type ServiceProviderProps = ExtractProps<typeof ServiceProvider>;