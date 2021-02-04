import {ClassSerializerInterceptor, Controller, Get, Res, UseInterceptors} from "@nestjs/common";
import {
    Crud,
    CrudController,
    CrudOptions,
    CrudRequest,
    CrudRequestInterceptor,
    Override,
    ParsedRequest
} from "@nestjsx/crud";
import {Response} from "express";
import {Parser} from 'json2csv';
import {getManager} from "typeorm";
import {Locale} from "./locale.entity";
import {LocaleService} from "./locale.service";

export const LocalePublicControllerOptions: CrudOptions = {
    model: {
        type: Locale,

    },
    routes: {
        only: ['getManyBase', 'getOneBase']
    }
}

/**
 * Return ProgramType formatted as
 * {}
 * {@link "./__snapshots__/program-type.public.controller.spec.ts.snap"}
 * @param req
 */
@Controller('api/public/locales')
@UseInterceptors(CrudRequestInterceptor, ClassSerializerInterceptor)
@Crud(LocalePublicControllerOptions)
export class LocalePublicController implements CrudController<Locale> {
    constructor(public service: LocaleService) {
    }

    get base(): CrudController<Locale> {
        return this;
    }

    @Override()
    async getMany(
        @ParsedRequest() req: CrudRequest,
    ) {
        // noinspection UnnecessaryLocalVariableJS
        const r = await this.base.getManyBase(req);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return Object.assign({}, ...r.map((locale: Locale) => ({[locale.id]: locale.value || locale.id})))

    }


    @Get("csv")
    async getCsv(@Res() response: Response,) {
        const data = await getManager().query("select id,value from locale")
        const json2csv = new Parser();
        const csv = json2csv.parse(data);
        response.header('Content-Type', 'text/csv');
        response.attachment("locale.csv");
        return response.send(csv);
    }
}
