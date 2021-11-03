---
description: How to provide a translation for the Squidex API and Management UI.
---

# Translating

## File structure

There are several translation files in the repository, but the files used by the API or the management UI are automated using the translation tool. You only have to update the files under `backend/i18n/source`.

![The file structure for source translation files](<../../.gitbook/assets/image (16).png>)

There are separate files for frontend and backend, one for each language.

The master language is **English **(`backend_en.json`and `fronend_en.json`).

## How to add a new language?

Please create a request in the support forum: [https://support.squidex.io ](https://support.squidex.io)

## How to update a language

To update the translation for a language you have to do the following steps:

1. Fork the source code.
2. Edit the corresponding json files with an editor.
3. Run the `translate.bat` or `translate.sh` file depending on your operation system.
4. Create a pull request.

{% hint style="info" %}
In the future the `translate.bat` file will be executed by the build server but it is not done yet.
{% endhint %}

## What is the translate.bat file doing?

As you can see the file executes the self developed translation tool which consist

```bash
dotnet run translate check-backend ..\..
dotnet run translate check-frontend ..\..

dotnet run translate gen-frontend ..\..
dotnet run translate gen-backend ..\..
```

### Checking the translations

The first step is to compare the translation files. It will do the following things:

1. The translator tool will loop over all code files (`*.html, *.cshtml, *.cs, *.ts`) to analyze which strings are not translated yet. You can try to fix these errors but it needs a lot of in-depth knowledge about the source code and architecture.
2. The translator tool will extract all used keys from the code files and compares the keys with the keys from the master language files and prints all keys that do not exist in the master language (**missing keys**) or exist in the master language file but not in the code files (**unused keys**). You can try to fix these errors, but it needs a lot of knowledge about the user experience.
3. The translator tool compare all the translation files for all other languages with the master language and output all keys that do not exist in language file (**missing keys**) or exist in the language file but not in the master language file (**unused keys**). Please try to fix all errors.

#### How to fix errors?

1. Key is missing: Get the English text from `backend_en.json` or `frontend_en.json` and translate the text to your language.
2. Key is unused: Just remove the label and the translation.

Sometimes the keys are renamed, but you it is easy to spot these cases when you see errors like this

```
Missing keys:
* new_KEY1
* new_KEY2

Unused keys:
* old_KEY1
* old_KEY2
```

You can just fix all these errors by replacing the prefix `old_` with `new_`.

### Generating the final files

The translator tool will also create the final files. It will take all translations for for all languages and adds missing translations from the master language files.

The frontend files are also generated as json files under `backend/i18n`:

![Final frontend files](<../../.gitbook/assets/image (17).png>)

The backend translations are generated as resx files under `backend/src/Squidex.Shared/`:

![Final backend files](<../../.gitbook/assets/image (18).png>)
