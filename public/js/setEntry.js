let currentEntry = -1
const setEntry = async (id) => {
  data = entry
  currentEntry = data
  title.value = data.title
  title.innerText = data.title
  date.value = data.date.slice(0, 10)
  if (isEditablePage()) {
    simplemde.value(data.markdown)
  } else {
    const markdown = document.querySelector('#entry-content')
    markdown.innerHTML = marked.parse(data.markdown)
  }
  document.title = `Diary Entry - ${data.title}`
  const date_label = document.querySelector('#dateText')
  const c = document.querySelector(`div[id="${id}"]`)
  c.addEventListener('click', (e) => {
    dustbinClick(c, e)
  })
  c.classList.add('selected')
  if (data.prev !== null && data.prev !== undefined)
    leftNavBtn.querySelector('a').setAttribute('href', `/entry/${data.prev}`)
  if (data.next !== null && data.next !== undefined)
    rightNavBtn.querySelector('a').setAttribute('href', `/entry/${data.next}`)
  const { readingTime } = await import(
    'https://cdn.jsdelivr.net/npm/reading-time-estimator@1.7.2/+esm'
  )
  let package = await import(
    'https://cdn.jsdelivr.net/npm/javascript-time-ago@2.5.10/+esm'
  )
  const TimeAgo = package.default
  TimeAgo.addDefaultLocale({
    locale: 'en',
    long: {
      year: {
        previous: 'last year',
        current: 'this year',
        next: 'next year',
        past: {
          one: '{0} year ago',
          other: '{0} years ago',
        },
        future: {
          one: 'in {0} year',
          other: 'in {0} years',
        },
      },
      quarter: {
        previous: 'last quarter',
        current: 'this quarter',
        next: 'next quarter',
        past: {
          one: '{0} quarter ago',
          other: '{0} quarters ago',
        },
        future: {
          one: 'in {0} quarter',
          other: 'in {0} quarters',
        },
      },
      month: {
        previous: 'last month',
        current: 'this month',
        next: 'next month',
        past: {
          one: '{0} month ago',
          other: '{0} months ago',
        },
        future: {
          one: 'in {0} month',
          other: 'in {0} months',
        },
      },
      week: {
        previous: 'last week',
        current: 'this week',
        next: 'next week',
        past: {
          one: '{0} week ago',
          other: '{0} weeks ago',
        },
        future: {
          one: 'in {0} week',
          other: 'in {0} weeks',
        },
      },
      day: {
        previous: 'yesterday',
        current: 'today',
        next: 'tomorrow',
        past: {
          one: '{0} day ago',
          other: '{0} days ago',
        },
        future: {
          one: 'in {0} day',
          other: 'in {0} days',
        },
      },
      hour: {
        current: 'this hour',
        past: {
          one: '{0} hour ago',
          other: '{0} hours ago',
        },
        future: {
          one: 'in {0} hour',
          other: 'in {0} hours',
        },
      },
      minute: {
        current: 'this minute',
        past: {
          one: '{0} minute ago',
          other: '{0} minutes ago',
        },
        future: {
          one: 'in {0} minute',
          other: 'in {0} minutes',
        },
      },
      second: {
        current: 'now',
        past: {
          one: '{0} second ago',
          other: '{0} seconds ago',
        },
        future: {
          one: 'in {0} second',
          other: 'in {0} seconds',
        },
      },
    },
    short: {
      year: {
        previous: 'last yr.',
        current: 'this yr.',
        next: 'next yr.',
        past: '{0} yr. ago',
        future: 'in {0} yr.',
      },
      quarter: {
        previous: 'last qtr.',
        current: 'this qtr.',
        next: 'next qtr.',
        past: {
          one: '{0} qtr. ago',
          other: '{0} qtrs. ago',
        },
        future: {
          one: 'in {0} qtr.',
          other: 'in {0} qtrs.',
        },
      },
      month: {
        previous: 'last mo.',
        current: 'this mo.',
        next: 'next mo.',
        past: '{0} mo. ago',
        future: 'in {0} mo.',
      },
      week: {
        previous: 'last wk.',
        current: 'this wk.',
        next: 'next wk.',
        past: '{0} wk. ago',
        future: 'in {0} wk.',
      },
      day: {
        previous: 'yesterday',
        current: 'today',
        next: 'tomorrow',
        past: {
          one: '{0} day ago',
          other: '{0} days ago',
        },
        future: {
          one: 'in {0} day',
          other: 'in {0} days',
        },
      },
      hour: {
        current: 'this hour',
        past: '{0} hr. ago',
        future: 'in {0} hr.',
      },
      minute: {
        current: 'this minute',
        past: '{0} min. ago',
        future: 'in {0} min.',
      },
      second: {
        current: 'now',
        past: '{0} sec. ago',
        future: 'in {0} sec.',
      },
    },
    narrow: {
      year: {
        previous: 'last yr.',
        current: 'this yr.',
        next: 'next yr.',
        past: '{0}y ago',
        future: 'in {0}y',
      },
      quarter: {
        previous: 'last qtr.',
        current: 'this qtr.',
        next: 'next qtr.',
        past: '{0}q ago',
        future: 'in {0}q',
      },
      month: {
        previous: 'last mo.',
        current: 'this mo.',
        next: 'next mo.',
        past: '{0}mo ago',
        future: 'in {0}mo',
      },
      week: {
        previous: 'last wk.',
        current: 'this wk.',
        next: 'next wk.',
        past: '{0}w ago',
        future: 'in {0}w',
      },
      day: {
        previous: 'yesterday',
        current: 'today',
        next: 'tomorrow',
        past: '{0}d ago',
        future: 'in {0}d',
      },
      hour: {
        current: 'this hour',
        past: '{0}h ago',
        future: 'in {0}h',
      },
      minute: {
        current: 'this minute',
        past: '{0}m ago',
        future: 'in {0}m',
      },
      second: {
        current: 'now',
        past: '{0}s ago',
        future: 'in {0}s',
      },
    },
    now: {
      now: {
        current: 'now',
        future: 'in a moment',
        past: 'just now',
      },
    },
    mini: {
      year: '{0}yr',
      month: '{0}mo',
      week: '{0}wk',
      day: '{0}d',
      hour: '{0}h',
      minute: '{0}m',
      second: '{0}s',
      now: 'now',
    },
    'short-time': {
      year: '{0} yr.',
      month: '{0} mo.',
      week: '{0} wk.',
      day: {
        one: '{0} day',
        other: '{0} days',
      },
      hour: '{0} hr.',
      minute: '{0} min.',
      second: '{0} sec.',
    },
    'long-time': {
      year: {
        one: '{0} year',
        other: '{0} years',
      },
      month: {
        one: '{0} month',
        other: '{0} months',
      },
      week: {
        one: '{0} week',
        other: '{0} weeks',
      },
      day: {
        one: '{0} day',
        other: '{0} days',
      },
      hour: {
        one: '{0} hour',
        other: '{0} hours',
      },
      minute: {
        one: '{0} minute',
        other: '{0} minutes',
      },
      second: {
        one: '{0} second',
        other: '{0} seconds',
      },
    },
  })
  const relativeTime = new TimeAgo('en-US').format(new Date(data.date))
  if (date_label) {
    date_label.innerHTML = new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(data.date))
    document.querySelector('#relativeTime').textContent = relativeTime
  }
  const { text } = readingTime(data.markdown)
  const readTime = document.querySelector('#readTime')
  if (readTime) readTime.textContent = text
}
