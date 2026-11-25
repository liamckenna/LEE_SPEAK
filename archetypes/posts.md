---
author: Liam McKenna
title: "{{ replace .File.ContentBaseName "_" " " | title }}"
date: {{ .Date }}
description:
comments_disabled: false
home_pin: false
draft: true
slug: {{ .File.ContentBaseName | urlize }}
tags: []
---
