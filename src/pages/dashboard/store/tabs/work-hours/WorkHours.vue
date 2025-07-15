<template>
  <div
    v-if="workHours.loading"
    class="q-pa-xl flex flex-center"
  >
    <q-spinner
      color="primary"
      size="80px"
    />
  </div>
  <div
    v-else
    class="q-col-gutter-md"
  >
    <div class="flex">
      <q-space />
      <q-btn
        :label="$t('dashboard.store.workHours.newWorkHour')"
        color="primary"
        unelevated
        :to="{ name: 'store/work-hours/new' }"
      />
    </div>
    <div class="scroll">
      <div class="work-hours row">
        <div class="col-auto">
          <div class="spacing" />
          <div
            v-for="__, hour in Array(13)"
            :key="hour"
            class="hour-label col"
          >
            {{ `${hour * 2}h` }}
          </div>
        </div>
        <div class="col">
          <div class="header row">
            <div class="col">
              <div>{{ $t('common.days.sunday') }}</div>
              <div class="total">
                {{
                  totalWorkHoursByDay[0]
                    ? $t('dashboard.store.workHours.totalOpened', {
                      totalOpened: totalOpened(totalWorkHoursByDay[0]),
                    })
                    : $t('dashboard.store.workHours.storeClosed')
                }}
              </div>
            </div>
            <div class="col">
              <div>{{ $t('common.days.monday') }}</div>
              <div class="total">
                {{
                  totalWorkHoursByDay[1]
                    ? $t('dashboard.store.workHours.totalOpened', {
                      totalOpened: totalOpened(totalWorkHoursByDay[1]),
                    })
                    : $t('dashboard.store.workHours.storeClosed')
                }}
              </div>
            </div>
            <div class="col">
              <div>{{ $t('common.days.tuesday') }}</div>
              <div class="total">
                {{
                  totalWorkHoursByDay[2]
                    ? $t('dashboard.store.workHours.totalOpened', {
                      totalOpened: totalOpened(totalWorkHoursByDay[2]),
                    })
                    : $t('dashboard.store.workHours.storeClosed')
                }}
              </div>
            </div>
            <div class="col">
              <div>{{ $t('common.days.wednesday') }}</div>
              <div class="total">
                {{
                  totalWorkHoursByDay[3]
                    ? $t('dashboard.store.workHours.totalOpened', {
                      totalOpened: totalOpened(totalWorkHoursByDay[3]),
                    })
                    : $t('dashboard.store.workHours.storeClosed')
                }}
              </div>
            </div>
            <div class="col">
              <div>{{ $t('common.days.thursday') }}</div>
              <div class="total">
                {{
                  totalWorkHoursByDay[4]
                    ? $t('dashboard.store.workHours.totalOpened', {
                      totalOpened: totalOpened(totalWorkHoursByDay[4]),
                    })
                    : $t('dashboard.store.workHours.storeClosed')
                }}
              </div>
            </div>
            <div class="col">
              <div>{{ $t('common.days.friday') }}</div>
              <div class="total">
                {{
                  totalWorkHoursByDay[5]
                    ? $t('dashboard.store.workHours.totalOpened', {
                      totalOpened: totalOpened(totalWorkHoursByDay[5]),
                    })
                    : $t('dashboard.store.workHours.storeClosed')
                }}
              </div>
            </div>
            <div class="col">
              <div>{{ $t('common.days.saturday') }}</div>
              <div class="total">
                {{
                  totalWorkHoursByDay[6]
                    ? $t('dashboard.store.workHours.totalOpened', {
                      totalOpened: totalOpened(totalWorkHoursByDay[6]),
                    })
                    : $t('dashboard.store.workHours.storeClosed')
                }}
              </div>
            </div>
          </div>
          <div class="row">
            <div class="days col row">
              <div
                v-for="_, day in Array(7)"
                :key="day"
                class="day col"
              >
                <div
                  v-for="__, hour in Array(12)"
                  :key="hour"
                  class="hour col"
                />
                <div
                  v-for="workHour in workHoursByDay[day]"
                  :key="workHour.id"
                  class="work-hour"
                  :style="{
                    top: `${getWorkHoursTop(workHour)}px`,
                    height: `${getWorkHoursHeight(workHour)}px`
                  }"
                  @click="editWorkHour(workHour)"
                >
                  <div>
                    {{ $t('dashboard.store.workHours.workHourPeriod', {
                      startTime: minutesToHour(workHour.startTime),
                      endTime: minutesToHour(workHour.endTime),
                    }) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <router-view v-slot="{ Component }">
      <q-dialog
        class="right-side-dialog"
        :model-value="$route.meta.isDialog"
        :position="$q.screen.lt.sm ? 'bottom' : 'right'"
        maximized
        full-height
        no-route-dismiss
        @hide="$router.push('/dashboard/store/work-hours')"
      >
        <div class="content">
          <component :is="Component" />
        </div>
      </q-dialog>
    </router-view>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator';
import { RouteLocationNormalized } from 'vue-router';
import { map, sum } from 'ramda';

import { ILoadable } from '@helpers/ILoadable';
import { getWorkHours } from '@api/restaurantWorkHours';
import { IWorkHours } from '@models/IWorkHours';

export default class List extends Vue {
  workHours: ILoadable<IWorkHours[]> = {
    loading: false,
    data: [],
  };

  beforeRouteUpdate(to: RouteLocationNormalized) {
    if (to.name === 'store/work-hours') {
      void this.loadWorkHours();
    }
  }

  created() {
    void this.loadWorkHours();
  }

  async loadWorkHours() {
    try {
      this.workHours.loading = true;

      this.workHours.data = await getWorkHours();
    } finally {
      this.workHours.loading = false;
    }
  }

  get workHoursByDay(): { [key: number]: IWorkHours[] } {
    return {
      0: this.getWorkHoursByDay(0),
      1: this.getWorkHoursByDay(1),
      2: this.getWorkHoursByDay(2),
      3: this.getWorkHoursByDay(3),
      4: this.getWorkHoursByDay(4),
      5: this.getWorkHoursByDay(5),
      6: this.getWorkHoursByDay(6),
    };
  }

  get totalWorkHoursByDay(): { [key: number]: number } {
    return {
      0: this.getTotalWorkHoursByDay(0),
      1: this.getTotalWorkHoursByDay(1),
      2: this.getTotalWorkHoursByDay(2),
      3: this.getTotalWorkHoursByDay(3),
      4: this.getTotalWorkHoursByDay(4),
      5: this.getTotalWorkHoursByDay(5),
      6: this.getTotalWorkHoursByDay(6),
    };
  }

  getWorkHoursByDay(weekDay: number) {
    return this.workHours.data.filter((workHour) => {
      return workHour.weekDay === weekDay;
    });
  }

  getTotalWorkHoursByDay(weekDay: number) {
    const workHours = this.workHoursByDay[weekDay];

    return sum(map((workHour) => {
      return workHour.endTime - workHour.startTime;
    }, workHours));
  }

  getWorkHoursTop(workHour: IWorkHours) {
    return (workHour.startTime / 60) * 20;
  }

  getWorkHoursHeight(workHour: IWorkHours) {
    return ((workHour.endTime - workHour.startTime) / 60) * 20;
  }

  totalOpened(totalMinutes: number) {
    const hours = (Math.trunc(totalMinutes / 60)).toString().padStart(2, '0');
    const minutes = (totalMinutes % 60).toString().padStart(2, '0');

    return `${hours}:${minutes}`;
  }

  minutesToHour(totalMinutes: number) {
    const hours = (Math.trunc(totalMinutes / 60)).toString().padStart(2, '0');
    const minutes = (totalMinutes % 60).toString().padStart(2, '0');

    if (hours === '24') {
      return '23:59';
    }

    return `${hours}:${minutes}`;
  }

  editWorkHour(workHour: IWorkHours) {
    void this.$router.push(`/dashboard/store/work-hours/${workHour.id || ''}`);
  }
}
</script>

<style lang="scss" scoped>
.work-hours {
  min-width: 900px;

  .header {
    text-align: center;
    font-weight: bold;
    color: $grey-6;
    height: 48px;

    .total {
      font-size: 0.8rem;
      font-weight: 300;
    }
  }

  .spacing {
    height: 48px;
  }

  .day {
    position: relative;
    border: 1px solid $separator-color;

    &:not(:last-child) {
      border-right: 0;
    }

    &:first-child {
      border-radius: $generic-border-radius 0 0 $generic-border-radius;
    }

    &:last-child {
      border-radius: 0 $generic-border-radius $generic-border-radius 0;
    }
  }

  .hour-label {
    height: 40px;
    color: $grey-8;
    font-size: 0.8rem;
    font-weight: 300;
    text-align: right;
    padding-right: 12px;
  }

  .hour {
    height: 40px;

    &:not(:first-child) {
      border-top: 1px solid $separator-color;
    }
  }

  .work-hour {
    padding: 8px;
    background: #FF572296;
    border-radius: 6px;
    position: absolute;
    width: 100%;
    min-height: 30px;
    color: white;

    &:hover {
      background: #FF5722;
      cursor: pointer;
    }
  }
}
</style>
