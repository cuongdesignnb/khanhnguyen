import prisma from "@/lib/prisma";
import { getSettingGroup } from "@/lib/site-config/settings";
import type {
  FloatingContactConfig,
  FloatingContactItem,
  ResolvedFloatingContactConfig,
} from "@/types/floating-contact";
import { defaultSettings } from "@/data/default-settings";
import {
  floatingContactSeedBaseUrl,
  floatingContactSeedIcons,
} from "@/data/floating-contact-icons";

type ContactSettings = {
  hotline?: string;
  zaloPhone?: string;
};

type SocialSettings = {
  facebook?: string;
  messenger?: string;
  zalo?: string;
  youtube?: string;
  tiktok?: string;
};

function cleanPhone(value: string | undefined) {
  return String(value || "").replace(/[^\d+]/g, "");
}

function resolveItemHref(
  item: FloatingContactItem,
  contact: ContactSettings,
  social: SocialSettings,
) {
  const explicitUrl = item.url?.trim() || "";
  const hotline = cleanPhone(contact.hotline);
  const zaloPhone = cleanPhone(contact.zaloPhone || contact.hotline).replace(
    /^\+/,
    "",
  );
  const sourceUrl = {
    hotline: hotline ? `tel:${hotline}` : "",
    zalo: social.zalo || (zaloPhone ? `https://zalo.me/${zaloPhone}` : ""),
    messenger: social.messenger || social.facebook || "",
    facebook: social.facebook || "",
    youtube: social.youtube || "",
    tiktok: social.tiktok || "",
    custom: "",
  }[item.dataSource];

  if (item.actionType === "phone") {
    const number = cleanPhone(explicitUrl || contact.hotline);
    return number ? `tel:${number}` : sourceUrl;
  }
  if (item.actionType === "zalo") {
    return explicitUrl || sourceUrl;
  }
  return explicitUrl || sourceUrl;
}

export async function getResolvedFloatingContactConfig(): Promise<ResolvedFloatingContactConfig> {
  try {
    await ensureFloatingContactSeed();
  } catch {
    // The production image is built without DATABASE_URL. Public rendering can
    // safely use defaults; runtime will seed as soon as the database is ready.
  }
  const [rawConfig, contact, social] = await Promise.all([
    getSettingGroup<Record<string, unknown>>("floating-contact.config"),
    getSettingGroup<Record<string, unknown>>("contact.info"),
    getSettingGroup<Record<string, unknown>>("social.links"),
  ]);

  const config = rawConfig as unknown as FloatingContactConfig;
  const items = Array.isArray(config.items) ? config.items : [];
  const mediaIds = items
    .map((item) => item.iconMediaId)
    .filter((id): id is string => Boolean(id));
  const media = mediaIds.length
    ? await prisma.mediaFile.findMany({
        where: { id: { in: mediaIds }, deletedAt: null },
        select: { id: true, url: true },
      })
    : [];
  const mediaById = new Map(media.map((entry) => [entry.id, entry.url]));

  return {
    enabled: config.enabled !== false,
    showOnMobile: config.showOnMobile !== false,
    showOnDesktop: config.showOnDesktop !== false,
    desktopTopPercent: Math.min(
      85,
      Math.max(15, Number(config.desktopTopPercent) || 50),
    ),
    mobileBackgroundColor: config.mobileBackgroundColor || "#ffffff",
    desktopBackgroundColor: config.desktopBackgroundColor || "#ffffff",
    items: items
      .filter((item) => item.isEnabled !== false)
      .sort((left, right) => left.sortOrder - right.sortOrder)
      .map((item) => ({
        ...item,
        href: resolveItemHref(
          item,
          contact as ContactSettings,
          social as SocialSettings,
        ),
        resolvedIconUrl:
          (item.iconMediaId && mediaById.get(item.iconMediaId)) ||
          item.iconUrl ||
          null,
      }))
      .filter((item) => Boolean(item.href)),
  };
}

export async function ensureFloatingContactSeed() {
  const existing = await prisma.setting.findUnique({
    where: {
      group_key: { group: "floating-contact.config", key: "main" },
    },
    select: { value: true },
  });
  const existingConfig = existing?.value as unknown as
    | FloatingContactConfig
    | undefined;
  const existingItems = new Map(
    (Array.isArray(existingConfig?.items) ? existingConfig.items : []).map(
      (item) => [item.id, item],
    ),
  );
  const configuredSeedItems = floatingContactSeedIcons
    .map((icon) => existingItems.get(icon.itemId))
    .filter((item): item is FloatingContactItem => Boolean(item));
  if (
    existingConfig &&
    configuredSeedItems.every((item) => Boolean(item.iconMediaId))
  ) {
    return;
  }

  await prisma.$transaction(async (transaction) => {
    for (const icon of floatingContactSeedIcons) {
      const url = `${floatingContactSeedBaseUrl}/${icon.filename}`;
      await transaction.mediaFile.upsert({
          where: { id: icon.mediaId },
          update: {},
          create: {
            id: icon.mediaId,
            filename: icon.filename,
            originalName: icon.filename,
            path: `public${url}`,
            url,
            mimeType: "image/svg+xml",
            extension: ".svg",
            size: 2048,
            width: 96,
            height: 96,
            alt: `Icon ${icon.itemId.replace("floating-", "")}`,
            title: `Thanh liên hệ - ${icon.itemId.replace("floating-", "")}`,
            type: "IMAGE",
          },
      });
    }

    const current = await transaction.setting.findUnique({
      where: {
        group_key: { group: "floating-contact.config", key: "main" },
      },
    });
    const base = (current?.value ||
      defaultSettings.floatingContactConfig) as unknown as FloatingContactConfig;
    const mediaByItem = new Map<string, string>(
      floatingContactSeedIcons.map((icon) => [icon.itemId, icon.mediaId]),
    );
    const items = (Array.isArray(base.items) ? base.items : []).map((item) => ({
      ...item,
      iconMediaId: item.iconMediaId || mediaByItem.get(item.id) || null,
    }));
    const value = { ...base, items };

    await transaction.setting.upsert({
      where: {
        group_key: { group: "floating-contact.config", key: "main" },
      },
      update: { value },
      create: {
        group: "floating-contact.config",
        key: "main",
        label: "floating-contact.config",
        value,
        type: "json",
        isPublic: true,
      },
    });
  });
}
