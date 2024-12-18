import { SocialLink as SocialLinkORM } from '@prisma/client';
import { CircleXIcon } from 'lucide-react';
import React from 'react';
import { useTypedFetcher } from 'remix-typedjson';
import { OnboardingStep } from '~/domain/faq/entities/user-profile';
import { OnboardUserFormErrors } from '~/domain/faq/services/onboard-user';
import { Alert, AlertDescription, AlertTitle } from '~/ui/atoms/alert';
import { Button } from '~/ui/atoms/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/ui/atoms/card';
import { Input } from '~/ui/atoms/input-field';
import { Label } from '~/ui/atoms/label';
import { SocialMediaTypeDropdown } from '~/ui/molecules/social-media-type-dropdown';

// This is only valid for the initial onboarding. We don't want to create duplicate items in the list!
export const SocialLinksForm = ({
  errorMessage,
}: {
  errorMessage: string | null;
}) => {
  const fetcherData = useTypedFetcher<{ formErrors?: OnboardUserFormErrors }>();
  // There really won't be any errors tbh. It either saves or not
  const formErrors = fetcherData?.data?.formErrors;
  const isSubmitting = fetcherData.state === 'submitting';

  const [socialLinks, setSocialLinks] = React.useState<
    { url: string; type: SocialLinkORM }[]
  >([
    {
      type: 'FACEBOOK',
      url: '',
    },
    {
      type: 'INSTAGRAM',
      url: '',
    },
  ]);

  const onAddNewLink = () => {
    setSocialLinks((c) => [...c, { type: 'FACEBOOK', url: '' }]);
  };

  const onRemoveLink = (indexItemToRemove: number) => {
    setSocialLinks(
      socialLinks.filter((c, index) => index !== indexItemToRemove)
    );
  };

  return (
    <fetcherData.Form
      method="POST"
      action="/onboarding"
      encType="multipart/form-data"
    >
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="space-y-3">
          <CardTitle className="text-2xl">Social Links</CardTitle>
          <span className="text-muted-foreground">
            Add your social links to personalize your profile and make it easier
            for others to connect with you
          </span>
        </CardHeader>
        <CardContent className="flex flex-col space-y-6">
          {errorMessage ? (
            <Alert variant="destructive">
              <AlertTitle>Failed to complete step</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          ) : null}

          <ul className="flex flex-col space-y-6">
            <input
              hidden
              name="onboarding"
              value={OnboardingStep.SOCIAL_LINKS}
              onChange={() => {}}
            />
            <input
              hidden
              name="socialLinks"
              value={JSON.stringify(socialLinks)}
              onChange={() => {}}
            />

            {socialLinks.map((link, index) => (
              <li
                key={`${link.type}${index}`}
                className="grid grid-cols-4 gap-6"
              >
                <div className="flex flex-col col-span-3 space-y-3">
                  <Label
                    className="text-sm font-medium"
                    htmlFor={`pending-externalLinks.${index}.url`}
                  >
                    Username
                  </Label>
                  <Input
                    name={`pending-externalLinks[${index}].url`}
                    placeholder="i.e. johnsmith"
                    className="h-11"
                    onChange={(e) =>
                      setSocialLinks(
                        socialLinks.map((c, currentIndex) =>
                          currentIndex !== index
                            ? c
                            : { ...c, url: e.target.value }
                        )
                      )
                    }
                    value={link.url}
                  />
                </div>

                <div className="col-span-1 flex items-end gap-4 flex-row">
                  <SocialMediaTypeDropdown
                    name={`pending-externalLinks[${index}].type`}
                    value={socialLinks?.[index]?.type}
                    onChange={(value) =>
                      setSocialLinks(
                        socialLinks.map((c, currentIndex) =>
                          currentIndex !== index ? c : { ...c, type: value }
                        )
                      )
                    }
                  />

                  <Button
                    type="button"
                    disabled={socialLinks.length === 1}
                    variant="ghost"
                    onClick={() => onRemoveLink(index)}
                    className="hover:bg-destructive/10"
                  >
                    <CircleXIcon className="h-5 w-5 text-destructive" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>

          <Button type="button" variant="ghost" onClick={onAddNewLink}>
            Add new link
          </Button>
        </CardContent>
        <CardFooter className="gap-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-1/2"
            variant="outline"
          >
            Skip
          </Button>
          <Button type="submit" disabled={isSubmitting} className="w-1/2">
            Next
          </Button>
        </CardFooter>
      </Card>
    </fetcherData.Form>
  );
};
