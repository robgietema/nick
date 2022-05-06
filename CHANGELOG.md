# Change Log

## 2.8.0 (unreleased)

### Breaking

### Feature

### Bugfix

### Internal

### Documentation

## 2.7.0 (2022-05-05)

### Feature

- Generate querystring endpoint based on indexes. @robgietema
- Added index data from catalog profile. @robgietema
- Added index model. @robgietema
- Added subjects vocabulary. @robgietema
- Added workflow states vocabulary. @robgietema

### Internal

- Upgrade dependencies. @robgietema
- Reorder configuration. @robgietema

### Documentation

- Fix installation instructions. @robgietema

## 2.6.0 (2022-05-04)

### Feature

- Remove items from navigation and search if you don't have the permission. @robgietema
- Added schema based controlpanels. @robgietema
- Added language controlpanel. @robgietema

### Bugfix

- Fixed language vocabulary. @robgietema

### Internal

- Added allowed users, groups and roles index. @robgietema
- Move controlpanels to separate files. @robgietema
- Use language settings from control panel. @robgietema
- Use mail settings from control panel. @robgietema
- Reorder configuration. @robgietema

## 2.6.0 (2022-05-03)

### Feature

- Add exclude from navigation behavior. @robgietema

### Bugfix

- Update translations. @robgietema
- Fix folder contents. @robgietema

### Internal

- Remove uuid from version. @robgietema
- Remove dependency on uuid-ossp extension. @robgietema
- Remove uuid from redirect. @robgietema

### Documentation

- Remove uuid-ossp extension from the documentation (not needed anymore). @robgietema

## 2.5.0 (2022-05-03)

### Feature

- Index documents in the catalog. @robgietema
- Add catalog model. @robgietema

### Bugfix

- Fix date fields. @robgietema
- Fix catalog (re)index. @robgietema

### Internal

- Convert jsonb fields to array fields. @robgietema
- Make search use the catalog. @robgietema

## 2.4.1 (2022-04-14)

### Bugfix

- Fix copy images/files. @robgietema
- Fix catalog indexes. @robgietema

## 2.4.0 (2022-04-13)

### Feature

- Added website. @robgietema
- Add favicon. @robgietema
- Add email notification routes. @robgietema
- Add system endpoint. @robgietema
- Added database endpoint. @robgietema

### Bugfix

- Fix site theming. @robgietema
- Fix translations. @robgietema

### Internal

- Refactor tests. @robgietema

### Documentation

- Added i18n documentation. @robgietema

## 2.3.0 (2022-04-12)

### Feature

- Add workflow history to documents. @robgietema
- Add password reset. @robgietema
- Add user registration. @robgietema
- Add filter content types. @robgietema
- Add sharing via local roles. @robgietema
- Added inherit roles. @robgietema
- Add copy / move route. @robgietema

### Bugfix

- Fix translations. @robgietema

### Internal

- Added translations. @robgietema
- Moved blob storage to var. @robgietema
- Removed unused code. @robgietema
- Upgrade knex. @robgietema

### Documentation

- Updated documentation. @robgietema

## 2.2.0 (2022-04-10)

### Feature

- Added vocabularies. @robgietema
- Added email route. @robgietema

### Internal

- Tests run in transactions. @robgietema
- Upgraded packages. @robgietema

### Documentation

- Added api documentation. @robgietema
- Added more documentation. @robgietema
- Added groups and roles documentation. @robgietema
- Added documentation. @robgietema

## 2.1.0 (2022-04-06)

### Feature

- Added transactions to api calls. @robgietema

### Bugfix

- Handle JWT error. @robgietema
- Remove response from view handlers. @robgietema
- Fix tests. @robgietema
- Fix translations. @robgietema

### Internal

- Refactor main app. @robgietema
- Move traverse to model. @robgietema
- Refactor view handlers. @robgietema
- Added translations. @robgietema
- Swap front- and backend, backend is now the root. @robgietema
- Cache schema in db. @robgietema
- Convert seeds to objection. @robgietema

### Documentation

- Fix readme. @robgietema

## 2.0.0 (2022-04-03)

### Breaking

- Added objection. @robgietema
- Refactor action/workflow to objection. @robgietema
- Refactor types to objection. @robgietema
- Refactor groups to objection. @robgietema
- Added update and delete methods to base model. @robgietema
- Converted user to objection. @robgietema
- Complete objection migration. @robgietema

### Internal

- Remove related links. @robgietema
- Refactor fetching permissions from user, groups and document. @robgietema
- Remove unused code from bookshelf. @robgietema

## 1.5.0 (2022-03-25)

### Feature

- Add behaviors. @robgietema
- Add folderish behavior. @robgietema
- Add actions endpoint. @robgietema

### Bugfix

- Fix translations. @robgietema
- Fix test. @robgietema

### Internal

- Added types and workflow translations. @robgietema

## 1.4.0 (2022-03-24)

### Feature

- Add blob storage support. @robgietema
- Update and delete files. @robgietema
- Add image handling. @robgietema
- Add revert history item. @robgietema
- Add i18n methods. @robgietema
- Add i18n. @robgietema
- Add translations. @robgietema

### Bugfix

- Structure sidepanel fixes. @robgietema
- Fix image scales. @robgietema

### Internal

- Refactor handle files. @robgietema
- Rename backend to nick. @robgietema

## 1.3.0 (2022-03-20)

### Feature

- Added profiles for importing data. @robgietema
- Add groups to user profiles. @robgietema
- Add sharing/local roles to profiles. @robgietema

### Bugfix

- Fix document profiles. @robgietema
- Make order optional for roles. @robgietema
- Prevent from deleting system groups and users. @robgietema

### Internal

- Remove redirect target from redirect model. @robgietema
- Move document profile imports to separate files. @robgietema
- Remove uuid from users and groups. @robgietema

### Documentation

- Add contents navigation mockup. @robgietema

## 1.3.0 (2022-03-19)

### Feature

- Add locking of documents. @robgietema
- Add ordering endpoint. @robgietema
- Added global roles. @robgietema
- Added groups. @robgietema
- Add users/groups endpoints. @robgietema

### Bugfix

- Fix position in parent field. @robgietema
- Check if item moved is not in sub of document to be moved. @robgietema

### Internal

- Upgrade volto version. @robgietema
- Fix tests. @robgietema
- Remove property case conversion. @robgietema

## 1.2.0 (2022-03-06)

### Feature

- Basic theming the frontend. @robgietema

### Internal

- Add test coverage. @robgietema
- Add more tests. @robgietema

### Documentation

- Added move command. @robgietema
- Add metadata fields to search. @robgietema
- Rewrite to async await from '.then'. @robgietema

## 1.1.0 (2022-03-06)

### Feature

- Extend search endpoint. @robgietema
- Added 301 redirects. @robgietema
- Add review permission. @robgietema
- Added workflows to documents. @robgietema
- Added owner to document. @robgietema
- Added workflow routes. @robgietema

### Bugfix

- Fix redirect. @robgietema

### Internal

- Added api src. @robgietema
- Fixed seeds. @robgietema
- Refactor route handler calls. @robgietema

## 1.0.1 (2022-03-02)

### Feature

- Added blocks to type schema. @robgietema

### Bugfix

- Fix breadcrumbs call. @robgietema
- Fix schema's. @robgietema
- Fix initial content. @robgietema
- Fix test. @robgietema

### Internal

- Added autoreload when code changes. @robgietema
- Upgrade dependency packages. @robgietema
- Upgrade bookshelf. @robgietema

### Documentation

- Fix readme. @robgietema

## 1.0.0 (2018-11-08)

### Feature

- Added authentication to login call. @robgietema
- Added JWT token generation. @robgietema
- JWT authentication. @robgietema
- Added roles and permissions. @robgietema
- Added basic search endpoint. @robgietema
- Add addable types. @robgietema

### Bugfix

- Fix root object calls. @robgietema

### Internal

- Added path to db. @robgietema

## 0.3.0 (2018-11-02)

### Feature

- Add child objects to content endpoints. @robgietema
- Added folderish property to documents. @robgietema

### Bugfix

- Fix add content bug. @robgietema

### Internal

- Fix dependencies. @robgietema

### Documentation

- Added documentation. @robgietema

## 0.2.0 (2018-11-02)

### Feature

- Added navigation endpoint. @robgietema
- Added breadcrumbs endpoint. @robgietema
- Added login endpoints. @robgietema
- Added actions endpoint. @robgietema
- Added layout support. @robgietema

### Bugfix

- Fix login endpoints. @robgietema
- Root fix. @robgietema

## 0.1.0 (2018-11-01)

### Feature

- Get content endpoint @robgietema
- Types endpoints. @robgietema
- Added create content call. @robgietema
- Add update content call. @robgietema
- Add delete content endpoint. @robgietema
