import {ClassSerializerInterceptor, Controller, UseInterceptors} from "@nestjs/common";
import {
  Crud,
  CrudController,
  CrudOptions,
  CrudRequest,
  CrudRequestInterceptor,
  Override,
  ParsedBody,
  ParsedRequest
} from "@nestjsx/crud";
import {Locale} from "./locale.entity";
import {LocaleService} from "./locale.service";

export const LocaleControllerOptions: CrudOptions = {
  model: {
    type: Locale,
  },
  routes: {
    only: ['createOneBase'],
  }
}

// noinspection JSUnusedLocalSymbols
/**
 * Return Profile formatted as
 * {}
 * {@link "./__snapshots__/profile.controller.seq.spec.ts.snap"}
 * @param req
 */

@Controller('api/locales')
@UseInterceptors(CrudRequestInterceptor, ClassSerializerInterceptor)
@Crud(LocaleControllerOptions)
export class LocaleController implements CrudController<Locale> {
  constructor(public service: LocaleService) {
  }

  get base(): CrudController<Locale> {
    return this;
  }

  @Override()
  createOne(
      @ParsedRequest() req: CrudRequest,
      @ParsedBody() dto: Locale,
  ) {
    try {
      return this.base.createOneBase(req, dto);
    } catch (e) {
      //ignored
    }
  }

}

