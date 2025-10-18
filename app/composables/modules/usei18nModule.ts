import { FindLocaleForUser } from "../../packages/translation/application/FindLocaleForUser";
import { LocaleSelectionRepositoryCookie } from "../../packages/translation/infra/locale-selection-repository-cookie";
import { SearchUserSelectedLocale } from "../../packages/translation/application/SearchUserSelectedLocale";
import { UserSelectsLocale } from "../../packages/translation/infra/ui/UserSelectsLocale";
import { SearchUserSelectedLocaleOnClientReady } from "../../packages/translation/infra/ui/SearchUserSelectedLocaleOnClientReady";

export default function () {
  const { $i18n } = useNuxtApp();
  const logger = useLogger();

  const localeSelectionRepository = new LocaleSelectionRepositoryCookie();
  const findLocaleForUser = new FindLocaleForUser(localeSelectionRepository, $i18n.getBrowserLocale);
  const findUserSelectedLocale = new SearchUserSelectedLocale(localeSelectionRepository);

  return {
    queries: {
      findLocaleForUser,
    },
    ui: {
      userSelectsLocale: new UserSelectsLocale(
        localeSelectionRepository,
        $i18n.setLocale,
        logger,
      ),
      searchUserSelectedLocaleOnClientReady: new SearchUserSelectedLocaleOnClientReady(findUserSelectedLocale, logger),
    },
  };
}
