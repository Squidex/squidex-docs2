---
description: How to Provide a Translation for the Squidex API and Management UI.
---

# Translating

## File Structure

There are several translation files in the repository but the files used by the API or the Management UI are automated using the translation tool. To use it, you only have to update the files under `backend/i18n/source`.

![The file structure for source translation files](<../../.gitbook/assets/image (16).png>)

There are separate files for frontend and backend, one for each language.

The master language is **English** (`backend_en.json`and `fronend_en.json`).

## How to Add a New Language

If you want to add a new language you have to complete a few manual steps:

1. Add the language to the backend: [https://github.com/Squidex/squidex/blob/de60af0bbb857cfb936edd3d1059d892e8f0bd1c/backend/src/Squidex/Config/Web/WebExtensions.cs#L35](https://github.com/Squidex/squidex/blob/de60af0bbb857cfb936edd3d1059d892e8f0bd1c/backend/src/Squidex/Config/Web/WebExtensions.cs#L35) (called culture in .NET).
2. Add the language to the frontend: [https://github.com/Squidex/squidex/blob/master/frontend/src/app/shared/state/ui-languages.ts](https://github.com/Squidex/squidex/blob/master/frontend/src/app/shared/state/ui-languages.ts). Please use the native name in your language as the display name.
3. Add the language to the translator tool: [https://github.com/Squidex/squidex/blob/master/backend/i18n/translator/Squidex.Translator/Commands.cs#L143](https://github.com/Squidex/squidex/blob/master/backend/i18n/translator/Squidex.Translator/Commands.cs#L143).
4. Create the backend translation file in the following folder: [https://github.com/Squidex/squidex/tree/master/backend/i18n/source](https://github.com/Squidex/squidex/tree/master/backend/i18n/source).
5. Create the frontend translation file in the following folder: [https://github.com/Squidex/squidex/tree/master/backend/i18n/source](https://github.com/Squidex/squidex/tree/master/backend/i18n/source).
6. Translate everything.
7. Run the translator.
8. Provide a PR.

## How to Update a Language

To update the translation for a language you need to complete the following steps:

1. Fork the source code.
2. Edit the corresponding JSON files with an editor.
3. Run the `translate.bat` or `translate.sh` file depending on the operation system.
4. Create a pull request.

{% hint style="info" %}
In the future, the `translate.bat` file will be executed by the build server but it is not quite ready yet.
{% endhint %}

## What Does the `translate.bat` File Do?

As you can see, the file executes the self-developed translation tool which consists of the following:

```bash
dotnet run translate check-backend ..\..
dotnet run translate check-frontend ..\..

dotnet run translate gen-frontend ..\..
dotnet run translate gen-backend ..\..
```

### Checking the Translations

The first step is to compare the translation files which do the following:

1. The translator tool will loop over all code files (`*.html, *.cshtml, *.cs, *.ts`) to analyze which strings are not translated yet. You can try to fix these errors but you'll need a lot of in-depth knowledge about the source code and architecture.
2. The translator tool will extract all used keys from the code files and compare the keys with the keys from the master language files.  It prints all keys that don't exist in the master language (**missing keys**) or that exist in the master language file but not in the code files (**unused keys**). You can try to fix these errors, but you will need a lot of knowledge about user experience.
3. The translator tool compares all the translation files for all other languages with the master language and outputs all keys that do not exist in the language file (**missing keys**) or exist in the language file but not in the master language file (**unused keys**). Please try to fix all errors.

#### How to Fix Errors?

1. Key is missing: Get the English text from `backend_en.json` or `frontend_en.json` and translate the text into your language.
2. Key is unused: Just remove the label and the translation.

Sometimes, the keys are renamed, but it's easy to spot them when you see errors such as these:

```
Missing keys:
* new_KEY1
* new_KEY2

Unused keys:
* old_KEY1
* old_KEY2
```

You can just fix all these errors by replacing the prefix `old_` with `new_`.

### Generating the Final Files

The translator tool will also create the final files. It will take all translations for for all languages and add missing translations from the master language files.

The frontend files are also generated as JSON files under `backend/i18n`:

![Final frontend files](<../../.gitbook/assets/image (17).png>)

The backend translations are generated as RESX files under `backend/src/Squidex.Shared/`:

![Final backend files](<../../.gitbook/assets/image (18).png>)
